import { IsString, IsEnum } from 'class-validator';
import { LikeStatus } from '../enum/users.enum';

export class LikeDislikeDto {
  @IsString()
  likedUserId: string;

  @IsEnum(LikeStatus)
  status: LikeStatus;
}
