import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PurchasePackageCategory } from '../enum/ms-purchase.enum';

export class CreateMsPurchaseDto {
  @IsNumber()
  @IsNotEmpty()
  msPackageId: number;

  @IsEnum(PurchasePackageCategory)
  purchasePackageCategory: PurchasePackageCategory;
}
