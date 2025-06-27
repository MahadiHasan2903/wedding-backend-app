import { PartialType } from '@nestjs/mapped-types';
import { CreateMsPurchaseDto } from './create-ms-purchase.dto';

export class UpdateMsPurchaseDto extends PartialType(CreateMsPurchaseDto) {}
