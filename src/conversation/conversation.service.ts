import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateLastMessageDto } from './dto/update-last-message.dto';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  /**
   * Creates a new conversation record in the database.
   * @param dto - Data transfer object containing senderId, receiverId, etc.
   * @returns The newly created Conversation entity.
   */
  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepository.create(dto);
    return await this.conversationRepository.save(conversation);
  }

  /**
   * Retrieves all conversations where the specified user is the sender.
   * @param senderId - UUID of the sender.
   * @returns An array of Conversation entities ordered by recent activity.
   */
  async findBySenderId(senderId: string): Promise<Conversation[]> {
    return await this.conversationRepository.findBySenderId(senderId);
  }

  /**
   * Retrieves a conversation by its ID only if the specified user is the sender.
   * Throws NotFoundException if no matching conversation is found.
   * @param id - UUID of the conversation.
   * @param senderId - UUID of the sender to validate ownership.
   * @returns The matching Conversation entity.
   * @throws NotFoundException if conversation does not exist or sender mismatch.
   */
  async findByIdAndSender(id: string, senderId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findByIdAndSender(
      id,
      senderId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Updates the last message information (message ID and text) for a conversation.
   * @param id - UUID of the conversation to update.
   * @param dto - DTO containing lastMessageId and lastMessage text.
   * @returns The updated Conversation entity.
   */
  async updateLastMessage(
    id: string,
    dto: UpdateLastMessageDto,
  ): Promise<Conversation> {
    return await this.conversationRepository.updateLastMessage(
      id,
      dto.lastMessageId,
      dto.lastMessage,
    );
  }
}
