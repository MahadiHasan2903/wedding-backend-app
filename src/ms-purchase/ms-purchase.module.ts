import { Module } from '@nestjs/common';
import { MsPurchaseService } from './ms-purchase.service';
import { MsPurchaseController } from './ms-purchase.controller';
import { MsPurchaseRepository } from './repositories/ms-purchase.repository';
import { MsPackageModule } from 'src/ms-package/msPackage.module';

@Module({
  imports: [MsPackageModule],
  exports: [MsPurchaseService, MsPurchaseRepository],
  controllers: [MsPurchaseController],
  providers: [MsPurchaseService, MsPurchaseRepository],
})
export class MsPurchaseModule {}
