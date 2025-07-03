import { IsUUID, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageStatus, MessageType } from '../enum/message.enum';

class MessageContentDto {
  originalText: string;
  translationEn: string;
  translationFr: string;
  translationEs: string;
}

export class CreateMessageDto {
  @IsUUID()
  conversationId: string;

  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @ValidateNested()
  @Type(() => MessageContentDto)
  message: MessageContentDto;

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
