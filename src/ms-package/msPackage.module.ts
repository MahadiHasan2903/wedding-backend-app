import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsPackage } from './entities/msPackage.entity';
import { MsPackageController } from './msPackage.controller';
import { MsPackageService } from './msPackage.service';
import { MsPackageRepository } from './repositories/msPackage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MsPackage])],
  controllers: [MsPackageController],
  providers: [MsPackageService, MsPackageRepository],
  exports: [MsPackageService, MsPackageRepository],
})
export class MsPackageModule {}
