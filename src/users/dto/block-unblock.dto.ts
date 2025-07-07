import { IsString, IsEnum } from 'class-validator';
import { BlockStatus } from '../enum/users.enum';

export class BlockUnblockDto {
  @IsString()
  blockedUserId: string;

  @IsEnum(BlockStatus)
  status: BlockStatus;
}
