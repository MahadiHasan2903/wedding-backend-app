import { Transform } from 'class-transformer';
import { MessageStatus, MessageType } from '../enum/message.enum';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  needsTranslation?: boolean = false;
}
