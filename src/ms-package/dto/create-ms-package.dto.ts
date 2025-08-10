import {
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PackageStatus, CategoryInfoType } from '../enum/msPackage.enum';

class CategoryInfoDto {
  @IsEnum(CategoryInfoType)
  category: CategoryInfoType;

  @IsNumber()
  originalPrice: number;

  @IsNumber()
  sellPrice: number;
}

export class CreateMsPackageDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  description: string[];

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @ValidateNested()
  @Type(() => CategoryInfoDto)
  categoryInfo: CategoryInfoDto;
}
