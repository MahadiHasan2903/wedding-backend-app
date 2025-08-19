import { Module } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MessageModule } from 'src/message/message.module';
import { EmailModule } from 'src/common/email/email.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MessageModule, EmailModule, UsersModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
