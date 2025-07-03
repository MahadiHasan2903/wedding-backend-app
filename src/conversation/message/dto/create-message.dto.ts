import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageStatus, MessageType } from '../enum/message.enum';

export class CreateMessageDto {
  @IsUUID()
  conversationId: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  message: string;

  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @IsEnum(MessageStatus)
  @IsOptional()
  status?: MessageStatus;

  @IsOptional()
  replyToMessageId?: number;

  @IsOptional()
  attachments?: any;
}
