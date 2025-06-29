import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { MediaModule } from 'src/media/media.module';
import { UserRepository } from './repositories/user.repository';
import { DataSource } from 'typeorm';
import { MsPackageModule } from 'src/ms-package/msPackage.module';
import { MsPurchaseModule } from 'src/ms-purchase/ms-purchase.module';
import { MediaService } from 'src/media/media.service';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { MsPackageRepository } from 'src/ms-package/repositories/msPackage.repository';
import { MsPurchaseRepository } from 'src/ms-purchase/repositories/ms-purchase.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MediaModule,
    MsPackageModule,
    MsPurchaseModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useFactory: (
        dataSource: DataSource,
        mediaService: MediaService,
        mediaRepository: MediaRepository,
        msPackageRepository: MsPackageRepository,
        msPurchaseRepository: MsPurchaseRepository,
      ) => {
        return new UserRepository(
          dataSource,
          mediaService,
          mediaRepository,
          msPackageRepository,
          msPurchaseRepository,
        );
      },
      inject: [
        DataSource,
        MediaService,
        MediaRepository,
        MsPackageRepository,
        MsPurchaseRepository,
      ],
    },
  ],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
