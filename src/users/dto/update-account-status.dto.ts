import { IsEnum } from 'class-validator';
import { AccountStatus } from '../enum/users.enum';

export class UpdateAccountStatusDto {
  @IsEnum(AccountStatus)
  accountStatus: AccountStatus;
}
