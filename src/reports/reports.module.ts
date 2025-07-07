import { Module } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [MessageModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
