import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/types';

@Controller('v1/account')
export class AccountController {
  /**
   * Inject AccountService to handle account-related operations.
   * @param accountService The account service instance.
   */
  constructor(private readonly accountService: AccountService) {}

  /**
   * Initiates user registration by checking for existing accounts and sending an OTP to the email.
   * @param createAccountDto - DTO containing new account details (email, password, etc.).
   * @returns Success message and OTP (in development), or conflict error if account already exists.
   * @throws HttpException if account creation or OTP sending fails.
   */
  @Post('registration-request')
  async create(@Body() createAccountDto: CreateAccountDto) {
    try {
      const { email, phoneNumber } = createAccountDto;

      const existingAccount = await this.accountService.findByEmailOrPhone(
        email,
        phoneNumber,
      );

      if (existingAccount) {
        return {
          status: HttpStatus.CONFLICT,
          success: false,
          message: `An account with this ${existingAccount.email === email ? 'email' : 'phone number'} already exists.`,
          data: {},
        };
      }

      const result = await this.accountService.create(createAccountDto);

      return {
        status: HttpStatus.OK,
        success: true,
        message: result.message,
        data: { ...(result.otp && { otp: result.otp }) },
      };
    } catch (error: unknown) {
      const sanitizedError =
        error instanceof Error ? error.message : JSON.stringify(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to create account',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Confirms OTP for registration and creates the actual user account.
   * @param body - DTO containing email and OTP.
   * @returns Created account details (excluding password) on success.
   * @throws HttpException if OTP is invalid or not found.
   */
  @Post('registration-confirmation')
  async confirm(@Body() body: ConfirmRegistrationDto) {
    try {
      const account = await this.accountService.verifyOtp(body.email, body.otp);
      const { password, ...accountWithoutPassword } = account;

      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'Account successfully created',
        data: accountWithoutPassword,
      };
    } catch (error: unknown) {
      const sanitizedError =
        error instanceof Error ? error.message : JSON.stringify(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'OTP verification failed',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Authenticates a user and returns a JWT along with basic user info.
   * @param signinDto - DTO containing email and password.
   * @returns JWT access token and user profile info.
   * @throws HttpException if credentials are invalid.
   */
  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    try {
      const { email, password } = signinDto;
      const result = await this.accountService.signin(email, password);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Signin successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      };
    } catch (error: unknown) {
      const sanitizedError =
        error instanceof Error ? error.message : JSON.stringify(error);

      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Invalid email or password',
          error: sanitizedError,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Logs out the user. JWT is stateless, so just acknowledges the logout.
   * @param req - The authenticated request object.
   * @returns Success message.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    await Promise.resolve(); // to satisfy linting rule requiring await in async function
    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Logout successful',
      data: {},
    };
  }

  /**
   * Changes the authenticated user's password after validating the current password.
   * @param req - The authenticated request object (contains user ID).
   * @param body - Object containing current and new passwords.
   * @returns Success message if password was updated.
   * @throws HttpException if current password is invalid or update fails.
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    console.log('Request:', req);
    const userId = Number(req.user.userId);
    const { currentPassword, newPassword } = body;

    await this.accountService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Password changed successfully',
      data: {},
    };
  }

  /**
   * Initiates the password reset process by sending an OTP to the user's email.
   * @param body - Object containing the user's email.
   * @returns Success message regardless of whether the email exists (for security).
   */
  @Post('forget-password-request')
  async forgetPasswordRequest(@Body() body: { email: string }) {
    const { email } = body;
    await this.accountService.forgetPasswordRequest(email);

    return {
      status: HttpStatus.OK,
      success: true,
      message: 'OTP sent to your email for password reset',
      data: {},
    };
  }

  /**
   * Confirms the OTP sent for password reset.
   * @param body - Object containing email and OTP.
   * @returns Success message if OTP is valid.
   * @throws HttpException if OTP is invalid or missing.
   */
  @Post('forget-password-confirmation')
  async forgetPasswordConfirmation(
    @Body() body: { email: string; otp: string },
  ) {
    await Promise.resolve(); // to satisfy linting rule requiring await in async function
    this.accountService.verifyForgetPasswordOtp(body.email, body.otp);

    return {
      status: HttpStatus.OK,
      success: true,
      message: 'OTP verified successfully',
      data: {},
    };
  }

  /**
   * Resets the user's password after OTP verification.
   * @param body - Object containing the email and new password.
   * @returns Success message if password is reset.
   * @throws HttpException if OTP was not verified or user does not exist.
   */
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    await this.accountService.resetPassword(body.email, body.newPassword);

    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Password reset successful',
      data: {},
    };
  }
}
