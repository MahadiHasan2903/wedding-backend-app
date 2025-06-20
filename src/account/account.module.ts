import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { EmailModule } from 'src/common/email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/guards/jwt/jwt.strategy';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  providers: [AccountService, JwtStrategy],
  controllers: [AccountController],
})
export class AccountModule {}
