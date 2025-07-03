import { Injectable } from '@nestjs/common';
import { MessageRepository } from './repositories/message.repository';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { Message } from './entities/message.entity';
import { UpdateMessageContentDto } from './dto/update-message-content.dto';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  /**
   * Creates a new message record in the database.
   * @param dto - Data transfer object containing new message details.
   * @returns The saved Message entity.
   */
  async create(dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(dto);
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
   * @param dto - DTO containing the new message content (translations and original text).
   * @returns The updated Message entity.
   */
  async updateMessageContent(
    id: string,
    dto: UpdateMessageContentDto,
  ): Promise<Message> {
    return this.messageRepository.updateMessageContent(id, dto.message);
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
