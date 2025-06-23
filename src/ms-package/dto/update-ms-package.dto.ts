import { PartialType } from '@nestjs/mapped-types';
import { CreateMsPackageDto } from './create-ms-package.dto';

export class UpdateMsPackageDto extends PartialType(CreateMsPackageDto) {}
