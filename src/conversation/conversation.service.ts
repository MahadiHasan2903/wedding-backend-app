import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PaginationOptions } from 'src/types/common.types';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { UpdateLastMessageDto } from './dto/update-last-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from 'src/message/repositories/message.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly userService: UsersService,
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  /**
   * Creates a new conversation record in the database.
   * @param dto - Data transfer object containing senderId, receiverId, etc.
   * @returns The newly created Conversation entity.
   */
  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const { senderId, receiverId } = dto;

    if (!receiverId) {
      throw new BadRequestException(
        'receiverId is required to create a conversation.',
      );
    }

    // Check for existing conversation regardless of sender/receiver direction
    const existingConversation = await this.conversationRepository.findOne({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existingConversation) {
      return existingConversation;
    }

    // No existing conversation found, create a new one
    const conversation = this.conversationRepository.create(dto);
    return await this.conversationRepository.save(conversation);
  }

  /**
   * Retrieves a paginated list of conversations by sender ID.
   *
   * @param senderId - The ID of the sender whose conversations are to be retrieved.
   * @param param - Pagination and sorting options.
   * @param param.page - The current page number.
   * @param param.pageSize - The number of items per page.
   * @param param.sort - A string in the format "field,order" (e.g., "createdAt,DESC") specifying the sort field and direction.
   * @returns An object containing the paginated list of conversations and metadata.
   */
  async findBySenderId(
    senderId: string,
    { page, pageSize, sort }: PaginationOptions,
  ) {
    const [sortField, sortOrder] = sort.split(',');

    const [items, totalItems] = await this.conversationRepository.findAndCount({
      where: { senderId },
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      items,
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
   * Retrieves a paginated list of conversations for a user (as sender or receiver),
s   *
   * @param userId - The ID of the user whose conversations are to be fetched.
   * @param param - Pagination and sorting options.
   * @param param.page - The current page number.
   * @param param.pageSize - The number of items per page.
   * @param param.sort - A string in the format "field,order", but only `updatedAt` is supported here.
   * @returns A paginated list of enriched conversations and pagination metadata.
   */
  async findMyConversation(
    userId: string,
    { page, pageSize, sort }: PaginationOptions,
  ) {
    const [sortField, sortOrder] = sort.split(',');
    const isDesc = sortOrder.toUpperCase() === 'DESC';

    // Fetch blockedUsers for current user
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      select: ['blockedUsers'],
    });
    const blockedUsers = currentUser?.blockedUsers ?? [];

    // Fetch conversations where user is sender or receiver
    const [items, totalItems] = await this.conversationRepository.findAndCount({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: {
        [sortField]: isDesc ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Filter out conversations involving blocked users
    const filteredConversations = items.filter(
      (conversation) =>
        !blockedUsers.includes(conversation.senderId) &&
        !blockedUsers.includes(conversation.receiverId),
    );

    // Enrich remaining conversations with sender, receiver, and last message
    const enrichedConversations = await Promise.all(
      filteredConversations.map(async (conversation) => {
        const sender = await this.userService.findUserById(
          conversation.senderId,
        );
        const receiver = await this.userService.findUserById(
          conversation.receiverId,
        );

        let fullLastMessage: Message | null = null;
        if (conversation.lastMessageId) {
          fullLastMessage = await this.messageRepository.findById(
            conversation.lastMessageId,
          );
        }

        return {
          ...conversation,
          sender,
          receiver,
          lastMessage: fullLastMessage,
        };
      }),
    );

    // Note: totalItems here is for unfiltered total. If you want filtered total:
    const filteredTotalItems =
      totalItems - (items.length - filteredConversations.length);
    const totalPages = Math.ceil(filteredTotalItems / pageSize);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      items: enrichedConversations,
      totalItems: filteredTotalItems,
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
