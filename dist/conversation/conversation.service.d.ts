import { UsersService } from 'src/users/users.service';
import { PaginationOptions } from 'src/types/common.types';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { UpdateLastMessageDto } from './dto/update-last-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from 'src/message/repositories/message.repository';
export declare class ConversationService {
    private readonly userService;
    private readonly userRepository;
    private readonly messageRepository;
    private readonly conversationRepository;
    constructor(userService: UsersService, userRepository: UserRepository, messageRepository: MessageRepository, conversationRepository: ConversationRepository);
    createConversation(dto: CreateConversationDto): Promise<Conversation>;
    findBySenderId(senderId: string, { page, pageSize, sort }: PaginationOptions): Promise<{
        items: Conversation[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    findMyConversation(userId: string, { page, pageSize, sort }: PaginationOptions): Promise<{
        items: {
            sender: import("../users/types/user.types").EnrichedUser;
            receiver: import("../users/types/user.types").EnrichedUser;
            lastMessage: Message | null;
            id: string;
            senderId: string;
            receiverId: string;
            lastMessageId: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    findByConversationId(id: string): Promise<{
        sender: import("../users/types/user.types").EnrichedUser;
        receiver: import("../users/types/user.types").EnrichedUser;
        id: string;
        senderId: string;
        receiverId: string;
        lastMessageId: string;
        lastMessage: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateLastMessage(id: string, dto: UpdateLastMessageDto): Promise<Conversation>;
}
