import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReportType } from '../enum/report.enum';

export class CreateReportDto {
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  receiverId: string;

  @IsNotEmpty()
  messageId: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  description?: string;
}
