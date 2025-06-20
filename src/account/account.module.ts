import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { EmailModule } from 'src/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  providers: [AccountService, JwtStrategy],
  controllers: [AccountController],
})
export class AccountModule {}
