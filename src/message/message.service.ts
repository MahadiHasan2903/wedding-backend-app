import { Injectable } from '@nestjs/common';
import { Language } from './enum/message.enum';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/entities/media.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageContent } from './entities/message.entity';
import { MessageRepository } from './repositories/message.repository';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { GoogleTranslateService } from './translation/google-translate.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly googleTranslateService: GoogleTranslateService,
    private readonly mediaRepository: MediaRepository,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Prepares the message content with optional translations.
   * @param message - The original message text to process.
   * @param needsTranslation - Whether the message should be translated into multiple languages.
   * @returns A Promise resolving to a structured `MessageContent` object.
   * @throws If no message is provided.
   */
  private async prepareMessageContent(
    message: string,
    needsTranslation: boolean,
  ): Promise<MessageContent> {
    if (!message) {
      throw new Error('Message is required');
    }

    console.log(message);

    if (needsTranslation) {
      const translations =
        await this.googleTranslateService.translateMessage(message);

      return {
        originalText: message,
        sourceLanguage: translations.originalLanguage,
        translationEn: translations.translationEn,
        translationFr: translations.translationFr,
        translationEs: translations.translationEs,
      };
    }

    return {
      originalText: message,
      sourceLanguage: Language.EN,
      translationEn: message,
      translationFr: '',
      translationEs: '',
    };
  }

  /**
   * Creates a new message record in the database.
   * @param dto - Data transfer object containing new message details.
   * @returns The saved Message entity.
   */
  async createMessage(
    dto: CreateMessageDto,
    files?: {
      attachments?: Express.Multer.File[];
    },
  ) {
    let messageContent: MessageContent | undefined;

    if (dto.message) {
      messageContent = await this.prepareMessageContent(
        dto.message,
        dto.needsTranslation || false,
      );
    }

    let attachmentIds: string[] = [];
    if (files?.attachments?.length) {
      const mediaList = await Promise.all(
        files.attachments.map((file) =>
          this.mediaService.handleUpload(
            file,
            'conversation_attachments',
            `users/${dto.senderId}/conversation-attachments`,
          ),
        ),
      );
      attachmentIds = mediaList.map((media) => media.id);
    }

    const message = this.messageRepository.create({
      ...dto,
      message: messageContent,
      attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
    });

    return this.messageRepository.save(message);
  }

  /**
   * Find a single message by its ID, including full media attachment objects.
   *
   * @param id - UUID of the message to retrieve.
   * @returns The message entity combined with a `fullAttachments` array containing
   *          the full Media objects for each attachment ID, or null if not found.
   */
  async findById(id: string) {
    // Fetch the message entity by its ID from the repository
    const message = await this.messageRepository.findOne({ where: { id } });

    if (!message) {
      return null;
    }

    let fullAttachments: Media[] = [];

    // If message has attachment IDs, resolve them to full Media objects
    if (message.attachments && message.attachments.length > 0) {
      const attachmentsWithNulls = await Promise.all(
        message.attachments.map((attachmentId) =>
          this.mediaRepository.findById(attachmentId),
        ),
      );

      // Filter out any null values if some attachments were not found
      fullAttachments = attachmentsWithNulls.filter(
        (media): media is Media => media !== null,
      );
    }

    // containing the resolved media objects for convenience in responses
    return {
      ...message,
      attachments: fullAttachments,
    };
  }

  /**
   * Retrieves all messages associated with a specific conversation.
   * Only non-deleted messages are returned.
   * @param conversationId - The UUID of the conversation.
   * @returns An array of Message entities sorted by creation date ascending.
   */
  async findByConversationId(conversationId: string) {
    // Fetch messages normally
    const messages =
      await this.messageRepository.findByConversationId(conversationId);

    // Replace attachments for each message with full media objects
    const messagesWithFullAttachments = await Promise.all(
      messages.map(async (message) => {
        if (message.attachments && message.attachments.length > 0) {
          const fullAttachments = await Promise.all(
            message.attachments.map((id) => this.mediaRepository.findById(id)),
          );

          // Return new message object with attachments replaced
          return {
            ...message,
            attachments: fullAttachments,
          };
        }

        // If no attachments, return message as is
        return message;
      }),
    );

    return messagesWithFullAttachments;
  }

  /**
   * Updates the multilingual message content for a given message ID.
   * @param id - The UUID of the message to update.
   * @param message -the new message content
   * @returns The updated Message entity.
   */
  async updateMessageContent(
    id: string,
    message: string,
    needsTranslation = false,
  ): Promise<Message> {
    const translatedContent = await this.prepareMessageContent(
      message,
      needsTranslation,
    );

    console.log(translatedContent);
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
