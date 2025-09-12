import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MediaModule } from 'src/media/media.module';
import { UserRepository } from './repositories/user.repository';
import { MsPackageModule } from 'src/ms-package/msPackage.module';
import { MsPurchaseModule } from 'src/ms-purchase/ms-purchase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MediaModule,
    MsPackageModule,
    forwardRef(() => MsPurchaseModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
