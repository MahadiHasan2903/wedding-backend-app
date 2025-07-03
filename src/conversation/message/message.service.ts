import { Injectable } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { Message } from './entities/message.entity';
import { GoogleTranslateService } from './translation/google-translate.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly googleTranslateService: GoogleTranslateService,
  ) {}

  /**
   * Creates a new message record in the database.
   * @param dto - Data transfer object containing new message details.
   * @returns The saved Message entity.
   */
  async create(dto: CreateMessageDto): Promise<Message> {
    const translations = await this.googleTranslateService.translateMessage(
      dto.message,
    );

    const message = this.messageRepository.create({
      ...dto,
      message: {
        originalText: dto.message,
        sourceLanguage: translations.originalLanguage,
        translationEn: translations.translationEn,
        translationFr: translations.translationFr,
        translationEs: translations.translationEs,
      },
    });
    return this.messageRepository.save(message);
  }

  /**
   * Retrieves all messages associated with a specific conversation.
   * Only non-deleted messages are returned.
   * @param conversationId - The UUID of the conversation.
   * @returns An array of Message entities sorted by creation date ascending.
   */
  async findByConversationId(conversationId: string): Promise<Message[]> {
    return this.messageRepository.findByConversationId(conversationId);
  }

  /**
   * Updates the multilingual message content for a given message ID.
   * @param id - The UUID of the message to update.
   * @param message -the new message content
   * @returns The updated Message entity.
   */
  async updateMessageContent(id: string, message: string): Promise<Message> {
    // Translate the new message content
    const translations =
      await this.googleTranslateService.translateMessage(message);

    // Prepare translated content in MessageContent structure
    const translatedContent = {
      originalText: message,
      sourceLanguage: translations.originalLanguage,
      translationEn: translations.translationEn,
      translationFr: translations.translationFr,
      translationEs: translations.translationEs,
    };

    // Pass structured content to repository
    return this.messageRepository.updateMessageContent(id, translatedContent);
  }

  /**
   * Soft-deletes or restores a message by updating its isDeleted status.
   * @param id - The UUID of the message to update.
   * @param dto - DTO containing the boolean isDeleted flag.
   * @returns The updated Message entity reflecting the new deletion status.
   */
  async updateIsDeleted(
    id: string,
    dto: UpdateMessageStatusDto,
  ): Promise<Message> {
    return this.messageRepository.updateMessageDeletionStatus(
      id,
      dto.isDeleted,
    );
  }
}
