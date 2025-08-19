import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
