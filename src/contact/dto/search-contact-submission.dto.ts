import { IsOptional, IsInt, Min, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchContactSubmissionDto {
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
  sort?: string = 'id,DESC';
}
