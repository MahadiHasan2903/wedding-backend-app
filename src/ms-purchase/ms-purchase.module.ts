import { forwardRef, Module } from '@nestjs/common';
import { MsPurchaseService } from './ms-purchase.service';
import { AccountModule } from 'src/account/account.module';
import { MsPurchaseController } from './ms-purchase.controller';
import { MsPackageModule } from 'src/ms-package/msPackage.module';
import { MsPurchaseRepository } from './repositories/ms-purchase.repository';

@Module({
  imports: [MsPackageModule, forwardRef(() => AccountModule)],
  exports: [MsPurchaseService, MsPurchaseRepository],
  controllers: [MsPurchaseController],
  providers: [MsPurchaseService, MsPurchaseRepository],
})
export class MsPurchaseModule {}
