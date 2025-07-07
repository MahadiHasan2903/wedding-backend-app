import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './repositories/message.repository';
import { GoogleTranslateService } from './translation/google-translate.service';
import { MediaModule } from 'src/media/media.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [MediaModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository,
    MessageGateway,
    GoogleTranslateService,
  ],
  exports: [MessageService, MessageRepository],
})
export class MessageModule {}
