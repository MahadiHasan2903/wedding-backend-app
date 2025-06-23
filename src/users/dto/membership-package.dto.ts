import { IsNumber, IsString } from 'class-validator';
export class MembershipPackageDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsNumber()
  originalPrice: number;

  @IsNumber()
  sellPrice: number;
}
