import { IsBoolean } from 'class-validator';

export class UpdateMessageStatusDto {
  @IsBoolean()
  isDeleted: boolean;
}
