import {
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PackageStatus, PriceOptionType } from '../enum/msPackage.enum';

class PriceOptionDto {
  @IsEnum(PriceOptionType)
  category: PriceOptionType;

  @IsNumber()
  originalPrice: number;

  @IsNumber()
  sellPrice: number;
}

export class CreateMsPackageDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceOptionDto)
  priceOptions: PriceOptionDto[];
}
