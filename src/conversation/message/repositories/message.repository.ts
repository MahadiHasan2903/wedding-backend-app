import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  /**
   * Constructs a MessageRepository using the provided DataSource.
   * This initializes the base Repository with the Message entity
   * and its associated EntityManager.
   *
   * @param dataSource - The TypeORM DataSource used to create the entity manager.
   */
  constructor(private readonly dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  /**
   * Finds all non-deleted messages belonging to a specific conversation.
   * Results are ordered by creation time in ascending order (oldest first).
   *
   * @param conversationId - UUID of the conversation whose messages to fetch.
   * @returns Promise resolving to an array of Message entities.
   */
  async findByConversationId(conversationId: string): Promise<Message[]> {
    return this.find({
      where: { conversationId, isDeleted: false },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Updates the soft-delete status (isDeleted) of a specific message by ID.
   * After updating, returns the updated Message entity.
   *
   * @param id - UUID of the message to update.
   * @param isDeleted - Boolean flag to set soft-delete status.
   * @returns Promise resolving to the updated Message entity.
   */
  async updateMessageDeletionStatus(
    id: string,
    isDeleted: boolean,
  ): Promise<Message> {
    await this.update(id, { isDeleted });
    return this.findOneByOrFail({ id });
  }

  /**
   * Updates the multilingual message content of a specific message by ID.
   * After updating, returns the updated Message entity.
   *
   * @param id - UUID of the message to update.
   * @param content - New message content object (translations and original text).
   * @returns Promise resolving to the updated Message entity.
   */
  async updateMessageContent(id: string, content: any): Promise<Message> {
    await this.update(id, { message: content });
    return this.findOneByOrFail({ id });
  }
}
