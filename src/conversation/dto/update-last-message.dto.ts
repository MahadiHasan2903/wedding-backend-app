import { IsString, IsUUID } from 'class-validator';

export class UpdateLastMessageDto {
  @IsUUID()
  lastMessageId: string;

  @IsString()
  lastMessage: string;
}
