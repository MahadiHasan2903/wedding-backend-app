import { DataSource, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationRepository extends Repository<Conversation> {
  /**
   * Constructs a ConversationRepository using the provided DataSource.
   * Initializes the base Repository with the Conversation entity
   * and its associated EntityManager.
   *
   * @param dataSource - The TypeORM DataSource used to create the entity manager.
   */
  constructor(private readonly dataSource: DataSource) {
    super(Conversation, dataSource.createEntityManager());
  }

  /**
   * Retrieves all conversations where the specified user is the sender.
   * Conversations are ordered by their last update time in descending order.
   *
   * @param senderId - UUID of the sender to filter conversations by.
   * @returns Promise resolving to an array of Conversation entities.
   */
  async findBySenderId(senderId: string): Promise<Conversation[]> {
    return this.find({
      where: { senderId },
      order: { updatedAt: 'DESC' },
    });
  }

  /**
   * Finds a single conversation by its ID only if it belongs to the specified sender.
   * Returns null if no matching conversation is found.
   *
   * @param id - UUID of the conversation to find.
   * @param senderId - UUID of the sender to validate ownership.
   * @returns Promise resolving to the Conversation entity or null.
   */
  async findByIdAndSender(
    id: string,
    senderId: string,
  ): Promise<Conversation | null> {
    return this.findOne({
      where: { id, senderId },
    });
  }

  /**
   * Updates the last message ID and content of a conversation by its ID.
   * Returns the updated Conversation entity after successful update.
   *
   * @param id - UUID of the conversation to update.
   * @param lastMessageId - UUID of the last message sent in the conversation.
   * @param lastMessage - Text content of the last message.
   * @returns Promise resolving to the updated Conversation entity.
   */
  async updateLastMessage(
    id: string,
    lastMessageId: string,
    lastMessage: string,
  ): Promise<Conversation> {
    await this.update(id, { lastMessageId, lastMessage });
    return this.findOneByOrFail({ id });
  }
}
