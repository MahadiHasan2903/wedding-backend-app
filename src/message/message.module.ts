import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { forwardRef, Module } from '@nestjs/common';
import { MediaModule } from 'src/media/media.module';
import { MessageController } from './message.controller';
import { MessageRepository } from './repositories/message.repository';
import { ConversationModule } from 'src/conversation/conversation.module';
import { GoogleTranslateService } from './translation/google-translate.service';

@Module({
  imports: [MediaModule, forwardRef(() => ConversationModule)],
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
