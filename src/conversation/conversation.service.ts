import { Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { ConversationRepository } from './repositories/conversation.repository';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateLastMessageDto } from './dto/update-last-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly userService: UsersService,
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
   * Retrieves all conversations where the specified user is either the sender or the receiver,
   * and enriches each conversation with full sender and receiver user information.
   *
   * @param userId - The UUID of the user whose conversations are to be fetched.
   * @returns A Promise that resolves to an array of conversations. Each conversation includes
   *          the original conversation data along with the populated `sender` and `receiver` user objects.
   */
  async findMyConversationByUserId(userId: string) {
    // fetch conversations
    const conversations = await this.conversationRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { updatedAt: 'DESC' },
    });

    // enrich each conversation with full sender and receiver info
    const enrichedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const sender = await this.userService.findUserById(
          conversation.senderId,
        );
        const receiver = await this.userService.findUserById(
          conversation.receiverId,
        );
        return {
          ...conversation,
          sender,
          receiver,
        };
      }),
    );

    return enrichedConversations;
  }

  /**
   * Retrieves a conversation by its ID only if the specified user is the sender.
   * Throws NotFoundException if no matching conversation is found.
   * @param id - UUID of the conversation.
   * @param senderId - UUID of the sender to validate ownership.
   * @returns The matching Conversation entity.
   * @throws NotFoundException if conversation does not exist or sender mismatch.
   */
  async findByConversationId(id: string) {
    const conversation =
      await this.conversationRepository.findByConversationId(id);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const sender = await this.userService.findUserById(conversation.senderId);
    const receiver = await this.userService.findUserById(
      conversation.receiverId,
    );

    return {
      ...conversation,
      sender,
      receiver,
    };
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
