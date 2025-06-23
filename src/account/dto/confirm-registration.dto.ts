import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
