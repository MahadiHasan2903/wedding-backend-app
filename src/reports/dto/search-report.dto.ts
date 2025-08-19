import { IsOptional, IsInt, Min, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchReportDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+,(ASC|DESC)$/i, {
    message: 'sort must be in the format "field,ASC" or "field,DESC"',
  })
  sort?: string = 'createdAt,DESC';

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/, {
    message: 'joined must be in format "YYYY-MM-DD - YYYY-MM-DD"',
  })
  dateRange?: string;
}
