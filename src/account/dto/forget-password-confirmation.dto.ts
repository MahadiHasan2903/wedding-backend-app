import { IsEmail, IsString, MinLength } from 'class-validator';

export class ForgetPasswordConfirmationDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
