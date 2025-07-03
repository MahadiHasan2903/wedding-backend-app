import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './repositories/message.repository';
import { GoogleTranslateService } from './translation/google-translate.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, GoogleTranslateService],
})
export class MessageModule {}
