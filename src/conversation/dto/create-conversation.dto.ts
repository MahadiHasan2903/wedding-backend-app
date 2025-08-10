import { IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId?: string;
}
