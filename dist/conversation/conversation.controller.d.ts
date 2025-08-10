import { HttpStatus } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateLastMessageDto } from './dto/update-last-message.dto';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
    createConversation(dto: CreateConversationDto): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/conversation.entity").Conversation;
    }>;
    getConversationsBySenderId(page: number | undefined, pageSize: number | undefined, sort: string | undefined, user: {
        userId: string;
    }): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            items: {
                sender: import("../users/types/user.types").EnrichedUser;
                receiver: import("../users/types/user.types").EnrichedUser;
                lastMessage: import("../message/entities/message.entity").Message | null;
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
        };
    }>;
    getConversationByIdAndSender(id: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            sender: import("../users/types/user.types").EnrichedUser;
            receiver: import("../users/types/user.types").EnrichedUser;
            id: string;
            senderId: string;
            receiverId: string;
            lastMessageId: string;
            lastMessage: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateLastMessage(id: string, dto: UpdateLastMessageDto): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/conversation.entity").Conversation;
    }>;
    getConversationsBySender(senderId: string, page?: number, pageSize?: number, sort?: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            items: import("./entities/conversation.entity").Conversation[];
            totalItems: number;
            itemsPerPage: number;
            currentPage: number;
            totalPages: number;
            hasPrevPage: boolean;
            hasNextPage: boolean;
            prevPage: number | null;
            nextPage: number | null;
        };
    }>;
}
