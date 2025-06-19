import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('registration-request')
  async create(@Body() createAccountDto: CreateAccountDto) {
    try {
      const { email, phoneNumber } = createAccountDto;

      // Check for existing account
      const existingAccount = await this.accountService.findByEmailOrPhone(
        email,
        phoneNumber,
      );
      if (existingAccount) {
        return {
          status: HttpStatus.CONFLICT,
          success: false,
          message: `An account with this ${existingAccount.email === email ? 'email' : 'phone number'} already exists.`,
        };
      }

      const account = await this.accountService.create(createAccountDto);
      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'Account created successfully',
        data: account,
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
}
