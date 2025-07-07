import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { MediaModule } from 'src/media/media.module';
import { UserRepository } from './repositories/user.repository';
import { MsPackageModule } from 'src/ms-package/msPackage.module';
import { MsPurchaseModule } from 'src/ms-purchase/ms-purchase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MediaModule,
    MsPackageModule,
    MsPurchaseModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
