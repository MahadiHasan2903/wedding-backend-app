import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './repositories/message.repository';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
})
export class MessageModule {}
