import { Module } from '@nestjs/common';
import { MsPurchaseService } from './ms-purchase.service';
import { MsPurchaseController } from './ms-purchase.controller';
import { MsPurchaseRepository } from './repositories/ms-purchase.repository';
import { DataSource } from 'typeorm';
import { MsPurchase } from './entities/ms-purchase.entity';
import { MsPackageModule } from 'src/ms-package/msPackage.module';

@Module({
  imports: [MsPackageModule],
  exports: [MsPurchaseService, MsPurchaseRepository],
  controllers: [MsPurchaseController],
  providers: [
    MsPurchaseService,
    {
      provide: MsPurchaseRepository,
      useFactory: (dataSource: DataSource) => {
        return dataSource
          .getRepository(MsPurchase)
          .extend(MsPurchaseRepository.prototype);
      },
      inject: [DataSource],
    },
  ],
})
export class MsPurchaseModule {}
