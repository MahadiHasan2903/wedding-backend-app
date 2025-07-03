import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MessageContentDto {
  @IsNotEmpty()
  originalText: string;

  @IsNotEmpty()
  translationEn: string;

  @IsNotEmpty()
  translationFr: string;

  @IsNotEmpty()
  translationEs: string;
}

export class UpdateMessageContentDto {
  @ValidateNested()
  @Type(() => MessageContentDto)
  message: MessageContentDto;
}
