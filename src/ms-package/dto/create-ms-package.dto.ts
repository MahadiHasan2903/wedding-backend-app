import {
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriceOptionType } from '../enum/msPackage.enum';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceOptionDto)
  priceOptions: PriceOptionDto[];
}
