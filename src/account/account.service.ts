import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { EmailService } from '../common/email/email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
  /**
   * In-memory store to temporarily hold OTPs and account data during registration.
   * Keyed by email address.
   */
  private otpStore = new Map<
    string,
    { otp: string; userData: CreateAccountDto }
  >();

  /**
   * In-memory store for OTPs related to password reset requests.
   * Keyed by email address.
   */
  private forgetPasswordOtpStore = new Map<string, string>();

  constructor(
    @InjectRepository(User)
    private readonly accountRepo: Repository<User>,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Finds an account by email or phone number.
   * @param email - Email address to search for.
   * @param phone - Optional phone number to search for.
   * @returns The matching account or null if not found.
   */
  async findByEmailOrPhone(
    email: string,
    phone?: string,
  ): Promise<User | null> {
    return this.accountRepo.findOne({
      where: [{ email }, ...(phone ? [{ phoneNumber: phone }] : [])],
    });
  }

  /**
   * Handles initial account registration by generating and emailing an OTP.
   * Temporarily stores the account data with the OTP.
   * @param createAccountDto - Account registration details.
   * @returns A message confirming OTP sent, and the OTP itself in development mode.
   */
  async create(
    createAccountDto: CreateAccountDto,
  ): Promise<{ message: string; otp?: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.otpStore.set(createAccountDto.email, {
      otp,
      userData: createAccountDto,
    });

    await this.sendOtpEmail(createAccountDto.email, otp);

    const response: { message: string; otp?: string } = {
      message: 'OTP sent to your email.',
    };

    if (process.env.NODE_ENV === 'development') {
      response.otp = otp;
    }

    return response;
  }

  /**
   * Sends an OTP email to the specified recipient.
   * @param to - The recipient's email address.
   * @param otp - The one-time password to be sent.
   */
  private async sendOtpEmail(to: string, otp: string) {
    const subject = 'Your OTP Code';
    const text = `Your verification code for France & Cuba Wedding App is: ${otp}.`;

    const html = `
      <p>Hello,</p>
      <p>Your verification code for <strong>France & Cuba Wedding App</strong> is:</p>
      <h2 style="color:#333;">${otp}</h2>
      <p>Please use this code to complete your registration.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <br/>
      <p>— France Cuba Wedding App Team</p>
    `;

    await this.emailService.sendMail(to, subject, text, html);
  }

  /**
   * Verifies the OTP sent for account registration and creates the account.
   * @param email - The email address associated with the OTP.
   * @param otp - The OTP code submitted by the user.
   * @returns The created account.
   * @throws If the OTP is missing or invalid.
   */
  async verifyOtp(email: string, otp: string): Promise<User> {
    const record = this.otpStore.get(email);
    if (!record) {
      throw new Error('No OTP request found for this email');
    }

    if (record.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(record.userData.password, 10);

    const account = this.accountRepo.create({
      ...record.userData,
      password: hashedPassword,
    });

    const savedAccount = await this.accountRepo.save(account);
    this.otpStore.delete(email);
    return savedAccount;
  }

  /**
   * Authenticates user credentials and returns a JWT token and user info.
   * @param email - The user's email.
   * @param password - The user's plain-text password.
   * @returns JWT access token and selected user details.
   * @throws If credentials are invalid.
   */
  async signin(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
      userRole: string;
    };
  }> {
    const account = await this.accountRepo.findOne({ where: { email } });
    if (!account) {
      throw new Error('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, account.password);
    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      userId: account.id,
      email: account.email,
      userRole: account.userRole,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return {
      user: {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phoneNumber: account.phoneNumber ?? null,
        userRole: account.userRole,
      },
      accessToken,
    };
  }

  /**
   * Changes the user's password after validating the current one.
   * @param userId - The authenticated user's ID.
   * @param currentPassword - The user's current password.
   * @param newPassword - The new password to be set.
   * @throws If the account is not found or the current password is incorrect.
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const account = await this.accountRepo.findOne({ where: { id: userId } });
    if (!account) throw new Error('Account not found');

    const passwordValid = await bcrypt.compare(
      currentPassword,
      account.password,
    );
    if (!passwordValid) throw new Error('Current password is incorrect');

    account.password = await bcrypt.hash(newPassword, 10);
    await this.accountRepo.save(account);
  }

  /**
   * Handles a password reset request by generating and emailing an OTP.
   * @param email - The email of the account requesting a reset.
   * @returns void (even if account is not found, to prevent info leakage).
   */
  async forgetPasswordRequest(email: string) {
    const account = await this.accountRepo.findOne({ where: { email } });
    if (!account) {
      // For security, don't reveal if email exists or not
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.forgetPasswordOtpStore.set(email, otp);
    await this.sendOtpEmail(email, otp);
  }

  /**
   * Verifies the OTP provided for password reset.
   * @param email - The email to verify the OTP against.
   * @param otp - The OTP provided by the user.
   * @throws If OTP is missing or invalid.
   */
  async verifyForgetPasswordOtp(email: string, otp: string) {
    await Promise.resolve();
    const storedOtp = this.forgetPasswordOtpStore.get(email);
    if (!storedOtp) throw new Error('No OTP request found for this email');
    if (storedOtp !== otp) throw new Error('Invalid OTP');
  }

  /**
   * Resets a user's password after OTP verification.
   * @param email - The user's email.
   * @param newPassword - The new password to be set.
   * @throws If the account is not found or OTP hasn't been verified.
   */
  async resetPassword(email: string, newPassword: string) {
    const account = await this.accountRepo.findOne({ where: { email } });
    if (!account) throw new Error('Account not found');

    if (!this.forgetPasswordOtpStore.has(email)) {
      throw new Error('OTP verification required before resetting password');
    }

    account.password = await bcrypt.hash(newPassword, 10);
    await this.accountRepo.save(account);
    this.forgetPasswordOtpStore.delete(email);
  }
}
