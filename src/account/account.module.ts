import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { AccountController } from './account.controller';
import { EmailModule } from 'src/common/email/email.module';
import { JwtStrategy } from '../common/guards/jwt/jwt.strategy';
import { MsPackageModule } from 'src/ms-package/msPackage.module';
import { AccountRepository } from './repositories/account.repository';
import { MsPurchaseModule } from 'src/ms-purchase/ms-purchase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    forwardRef(() => UsersModule),
    MsPackageModule,
    forwardRef(() => MsPurchaseModule),
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
