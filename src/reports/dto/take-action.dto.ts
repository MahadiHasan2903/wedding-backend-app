import { ReportAction } from '../enum/report.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class TakeActionDto {
  @IsEnum(ReportAction)
  @IsNotEmpty()
  action: ReportAction;
}
