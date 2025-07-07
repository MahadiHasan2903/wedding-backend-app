import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageStatus, MessageType } from '../enum/message.enum';

export class CreateMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType;

  @IsEnum(MessageStatus)
  @IsOptional()
  status?: MessageStatus;

  @IsOptional()
  replyToMessageId?: string;

  @IsOptional()
  attachments?: string[];
}
