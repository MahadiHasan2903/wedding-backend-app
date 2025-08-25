import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMessageContentDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  needTranslation?: boolean = true;
}
