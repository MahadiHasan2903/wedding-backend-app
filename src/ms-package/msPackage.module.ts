import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MsPackage } from './entities/msPackage.entity';
import { MsPackageController } from './msPackage.controller';
import { MsPackageService } from './msPackage.service';
import { MsPackageRepository } from './repositories/msPackage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MsPackage])],
  controllers: [MsPackageController],
  providers: [
    MsPackageService,
    {
      provide: MsPackageRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource
          .getRepository(MsPackage)
          .extend(MsPackageRepository.prototype),
      inject: [getDataSourceToken()],
    },
  ],
  exports: [MsPackageService, MsPackageRepository],
})
export class MsPackageModule {}
