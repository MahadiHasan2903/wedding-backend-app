import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { EmailModule } from 'src/common/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/guards/jwt/jwt.strategy';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { AccountRepository } from './repositories/account.repository';
import { MsPackageModule } from 'src/ms-package/msPackage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    MsPackageModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  providers: [
    AccountService,
    JwtStrategy,
    {
      provide: AccountRepository,
      useFactory: (dataSource: DataSource) => {
        return new AccountRepository(dataSource);
      },
      inject: [getDataSourceToken()],
    },
  ],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
