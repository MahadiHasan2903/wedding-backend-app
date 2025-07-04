import { Injectable } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { Message } from './entities/message.entity';
import { GoogleTranslateService } from './translation/google-translate.service';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly googleTranslateService: GoogleTranslateService,
    private readonly mediaRepository: MediaRepository,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Creates a new message record in the database.
   * @param dto - Data transfer object containing new message details.
   * @returns The saved Message entity.
   */
  async create(
    dto: CreateMessageDto,
    files?: {
      attachments?: Express.Multer.File[];
    },
  ) {
    // Assign messageContent directly or undefined if dto.message is missing
    const messageContent = dto.message
      ? await (async () => {
          const translations =
            await this.googleTranslateService.translateMessage(
              dto.message as string,
            );

          return {
            originalText: dto.message,
            sourceLanguage: translations.originalLanguage,
            translationEn: translations.translationEn,
            translationFr: translations.translationFr,
            translationEs: translations.translationEs,
          };
        })()
      : undefined;

    // Upload attachments and collect their media IDs
    let attachmentIds: string[] = [];
    if (files?.attachments && files.attachments.length > 0) {
      const mediaList = await Promise.all(
        files.attachments.map((file) =>
          this.mediaService.handleUpload(
            file,
            'conversation_attachments',
            `users/${dto.senderId}/conversation-attachments`,
          ),
        ),
      );

      // store media IDs in attachments
      attachmentIds = mediaList.map((media) => media.id);
    }

    // Create and save the message entity
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
