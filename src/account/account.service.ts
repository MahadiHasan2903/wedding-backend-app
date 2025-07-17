import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { EmailService } from '../common/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus } from 'src/users/enum/users.enum';
import { User } from 'src/users/entities/user.entity';
import { MsPackageRepository } from 'src/ms-package/repositories/msPackage.repository';
import { PurchasePackageCategory } from 'src/ms-purchase/enum/ms-purchase.enum';
import { MsPurchaseService } from 'src/ms-purchase/ms-purchase.service';

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
    private readonly msPackageRepo: MsPackageRepository,
    private readonly msPurchaseService: MsPurchaseService,
    private readonly accountRepo: AccountRepository,
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
    return this.accountRepo.findByEmailOrPhone(email, phone);
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

    await this.emailService.sendMail({
      to,
      subject,
      text,
      html,
    });
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
    const { profilePicture, additionalPhotos, ...rest } = record.userData;

    // Create and save the user account first
    const account = this.accountRepo.create({
      ...rest,
      password: hashedPassword,
    });
    const savedAccount = await this.accountRepo.save(account);

    // Fetch the default package (id = 1)
    const defaultPackage = await this.msPackageRepo.findOne({
      where: { id: 1 },
    });

    if (!defaultPackage) {
      throw new Error('Default membership package not found');
    }

    // Create the membership purchase for the new user
    const purchaseInfo = await this.msPurchaseService.createPurchase(
      savedAccount.id,
      defaultPackage.id,
      PurchasePackageCategory.LIFETIME,
    );

    // Update the savedAccount with msPurchaseId and save again
    savedAccount.purchasedMembership = purchaseInfo.id;
    await this.accountRepo.save(savedAccount);

    // Attach purchase info inside the user object as `membership`
    const userWithMembership = {
      ...savedAccount,
    };

    // Delete OTP record
    this.otpStore.delete(email);

    return userWithMembership;
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
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string | null;
      userRole: string;
      accountStatus: AccountStatus;
    };
  }> {
    const account = await this.accountRepo.findByEmail(email);
    if (!account) {
      throw new Error('Invalid credentials');
    }

    // Check if account status is blocked or deleted
    if (account.accountStatus === AccountStatus.BLOCK) {
      throw new Error(
        'Your account has been blocked. Please contact support for assistance.',
      );
    } else if (account.accountStatus === AccountStatus.DELETE) {
      throw new Error('Your account has been deleted and cannot be accessed.');
    }

    const passwordValid = await bcrypt.compare(password, account.password);
    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }

    // If account is inactive, update status to active
    if (account.accountStatus === AccountStatus.INACTIVE) {
      account.accountStatus = AccountStatus.ACTIVE;
      await this.accountRepo.save(account);
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
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phoneNumber: account.phoneNumber ?? null,
        userRole: account.userRole,
        accountStatus: account.accountStatus,
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
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const account = await this.accountRepo.findById(userId);
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
    const account = await this.accountRepo.findByEmail(email);
    if (!account) {
      // For security, don't reveal if email exists or not
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.forgetPasswordOtpStore.set(email, otp);
    await this.sendOtpEmail(email, otp);

    return otp;
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
    if (!storedOtp) {
      throw new Error('No OTP request found for this email');
    }
    if (storedOtp !== otp) {
      throw new Error('Invalid OTP');
    }
  }

  /**
   * Resets a user's password after OTP verification.
   * @param email - The user's email.
   * @param newPassword - The new password to be set.
   * @throws If the account is not found or OTP hasn't been verified.
   */
  async resetPassword(email: string, newPassword: string) {
    const account = await this.accountRepo.findByEmail(email);
    if (!account) {
      throw new Error('Account not found');
    }

    if (!this.forgetPasswordOtpStore.has(email)) {
      throw new Error('OTP verification required before resetting password');
    }

    account.password = await bcrypt.hash(newPassword, 10);
    await this.accountRepo.save(account);
    this.forgetPasswordOtpStore.delete(email);
  }
}
