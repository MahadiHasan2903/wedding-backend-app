import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { EmailModule } from 'src/common/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/guards/jwt/jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { AccountRepository } from './repositories/account.repository';
import { MsPackageModule } from 'src/ms-package/msPackage.module';
import { MsPurchaseModule } from 'src/ms-purchase/ms-purchase.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    UsersModule,
    MsPackageModule,
    MsPurchaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  providers: [AccountService, AccountRepository, JwtStrategy],
  controllers: [AccountController],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
