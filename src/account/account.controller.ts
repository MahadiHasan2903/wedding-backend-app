import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { sanitizeError } from 'src/utils/helpers';
import { AccountService } from './account.service';
import { UserRole } from 'src/users/enum/users.enum';
import { CreateAccountDto } from './dto/create-account.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ForgetPasswordConfirmationDto } from './dto/forget-password-confirmation.dto';

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
  @Public()
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
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to create account',
          error: sanitizeError(error),
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
  @Public()
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
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'OTP verification failed',
          error: sanitizeError(error),
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
  @Public()
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
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Invalid email or password',
          error: sanitizeError(error),
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
  @Roles(UserRole.USER, UserRole.ADMIN)
  async logout() {
    await Promise.resolve();
    return {
      status: HttpStatus.OK,
      success: true,
      message: 'Logout successful',
      data: {},
    };
  }

  /**
   * Initiates the password reset process by sending an OTP to the user's email.
   * @param body - Object containing the user's email.
   * @returns Success message regardless of whether the email exists (for security).
   */
  @Public()
  @Post('forget-password-request')
  async forgetPasswordRequest(@Body() body: { email: string }) {
    try {
      const otp = await this.accountService.forgetPasswordRequest(body.email);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'OTP sent to your email for password reset',
        data: process.env.NODE_ENV === 'production' ? {} : { otp },
      };
    } catch (error: unknown) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to send OTP for password reset',
          error: sanitizeError(error),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('verify-forget-password-otp')
  async verifyForgetPasswordOtp(@Body() body: { email: string; otp: string }) {
    try {
      await this.accountService.verifyForgetPasswordOtp(body.email, body.otp);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'OTP verified successfully',
        data: {},
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to verify OTP',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Confirms the OTP sent for password reset.
   * @param body - Object containing email and OTP.
   * @returns Success message if OTP is valid.
   * @throws HttpException if OTP is invalid or missing.
   */
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: ForgetPasswordConfirmationDto) {
    try {
      await this.accountService.verifyForgetPasswordOtp(body.email, body.otp);

      await this.accountService.resetPassword(body.email, body.newPassword);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Password updated successfully',
        data: {},
      };
    } catch (error: unknown) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'OTP verification or password update failed',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Changes the authenticated user's password after validating the current password.
   * @param req - The authenticated request object (contains user ID).
   * @param body - Object containing current and new passwords.
   * @returns Success message if password was updated.
   * @throws HttpException if current password is invalid or update fails.
   */
  @Post('change-password')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async changePassword(
    @CurrentUser() user: { userId: string },
    @Body() body: ChangePasswordDto,
  ) {
    try {
      const userId = user.userId;
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
    } catch (error: unknown) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Password change failed',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
