import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from './enum/message.enum';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/entities/media.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageContent } from './entities/message.entity';
import { MessageRepository } from './repositories/message.repository';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { GoogleTranslateService } from './translation/google-translate.service';
import { ConversationRepository } from 'src/conversation/repositories/conversation.repository';
import { PaginationOptions } from 'src/types/common.types';
import { In } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
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
    files?: { attachments?: Express.Multer.File[] },
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
    } else if (dto.attachments?.length) {
      attachmentIds = dto.attachments;
    }

    const newMessage = this.messageRepository.create({
      ...dto,
      message: messageContent,
      attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    await this.conversationRepository.update(dto.conversationId, {
      lastMessageId: savedMessage.id,
      lastMessage: dto.message ?? '[attachment]',
      senderId: dto.senderId,
      receiverId: dto.receiverId,
      createdAt: new Date(),
    });

    // Replace deprecated findByIds
    const mediaItems = attachmentIds.length
      ? await this.mediaRepository.find({
          where: { id: In(attachmentIds) },
        })
      : [];

    // Declare repliedMessage before use
    let repliedMessage: Message | null = null;
    if (dto.repliedToMessage) {
      repliedMessage = await this.messageRepository.findOne({
        where: { id: dto.repliedToMessage },
      });
    }

    return {
      ...savedMessage,
      attachments: mediaItems,
      ...(repliedMessage ? { repliedToMessage: repliedMessage } : {}),
    };
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
   * @param param - Pagination and sorting options.
   * @param param.page - The current page number.
   * @param param.pageSize - The number of items per page.
   * @param param.sort - A string in the format "field,order", but only `createdAt` is supported here.
   * @returns A paginated list of messages and pagination metadata.
   */
  async findByConversationId(
    conversationId: string,
    { page, pageSize, sort }: PaginationOptions,
  ) {
    const [sortField, sortOrder] = sort.split(',');
    const isDesc = sortOrder.toUpperCase() === 'DESC';

    // Fetch paginated messages
    const [items, totalItems] = await this.messageRepository.findAndCount({
      where: { conversationId },
      order: {
        [sortField]: isDesc ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Enrich messages with full media details for attachments
    const enrichedMessages = await Promise.all(
      items.map(async (message) => {
        let fullAttachments: (Media | null)[] = [];
        if (message.attachments?.length) {
          fullAttachments = await Promise.all(
            message.attachments.map((id) => this.mediaRepository.findById(id)),
          );
        }

        let repliedToMessage: Message | null = null;
        if (message.repliedToMessage) {
          repliedToMessage = await this.messageRepository.findOne({
            where: { id: message.repliedToMessage },
          });
        }

        return {
          ...message,
          attachments: fullAttachments,
          repliedToMessage,
        };
      }),
    );

    // Pagination metadata
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      items: enrichedMessages,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
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
  ) {
    // Prepare the content (translated or not)
    const translatedContent = await this.prepareMessageContent(
      message,
      needsTranslation,
    );

    // Await updatedMessage correctly
    const updatedMessage = await this.messageRepository.updateMessageContent(
      id,
      translatedContent,
    );

    // Check if repliedToMessage exists before querying
    let repliedMessage: Message | null = null;
    if (updatedMessage.repliedToMessage) {
      repliedMessage = await this.messageRepository.findOne({
        where: { id: updatedMessage.repliedToMessage },
      });
    }

    // Return the updated message with the nested replied message object
    return {
      ...updatedMessage,
      repliedToMessage: repliedMessage,
    };
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

  /**
   *
   * @param mediaId - The ID of the media attachment to remove.
   */
  async removeAttachment(mediaId: string): Promise<void> {
    // Find the media record
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });
    if (!media) {
      throw new NotFoundException(`Attachment with id ${mediaId} not found`);
    }

    // Find messages containing this attachment ID
    const messagesWithAttachment = await this.messageRepository
      .createQueryBuilder('message')
      .where(':mediaId = ANY(message.attachments)', { mediaId })
      .getMany();

    // Remove attachment ID from messages
    for (const message of messagesWithAttachment) {
      if (!message.attachments) continue;

      message.attachments = message.attachments.filter((id) => id !== mediaId);
      await this.messageRepository.save(message);
    }

    // Delete the media from S3 and database
    await this.mediaService.deleteMediaById(mediaId);
  }
}
