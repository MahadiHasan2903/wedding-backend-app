// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MediaModule } from 'src/common/media/media.module';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MediaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
