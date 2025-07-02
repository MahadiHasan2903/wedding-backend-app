import { IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../enum/users.enum';

export class UpdateUserRoleDto {
  @IsUUID()
  userId: string;

  @IsEnum(UserRole)
  userRole: UserRole;
}
