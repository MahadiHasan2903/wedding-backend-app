import { HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { UpdateMessageContentDto } from './dto/update-message.dto';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    create(dto: CreateMessageDto, files: {
        attachments?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            repliedToMessage: string | import("./entities/message.entity").Message;
            attachments: import("../media/entities/media.entity").Media[];
            id: string;
            conversationId: string;
            senderId: string;
            receiverId: string;
            message?: import("./entities/message.entity").MessageContent;
            messageType: import("./enum/message.enum").MessageType;
            status: import("./enum/message.enum").MessageStatus;
            readAt: Date;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getByConversationId(conversationId: string, page?: number, pageSize?: number, sort?: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            items: {
                attachments: (import("../media/entities/media.entity").Media | null)[];
                repliedToMessage: import("./entities/message.entity").Message | null;
                id: string;
                conversationId: string;
                senderId: string;
                receiverId: string;
                message?: import("./entities/message.entity").MessageContent;
                messageType: import("./enum/message.enum").MessageType;
                status: import("./enum/message.enum").MessageStatus;
                readAt: Date;
                isDeleted: boolean;
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
    getById(id: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            attachments: import("../media/entities/media.entity").Media[];
            id: string;
            conversationId: string;
            senderId: string;
            receiverId: string;
            message?: import("./entities/message.entity").MessageContent;
            messageType: import("./enum/message.enum").MessageType;
            status: import("./enum/message.enum").MessageStatus;
            readAt: Date;
            repliedToMessage: string;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateMessageContent(id: string, body: UpdateMessageContentDto): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            repliedToMessage: import("./entities/message.entity").Message | null;
            id: string;
            conversationId: string;
            senderId: string;
            receiverId: string;
            message?: import("./entities/message.entity").MessageContent;
            messageType: import("./enum/message.enum").MessageType;
            status: import("./enum/message.enum").MessageStatus;
            readAt: Date;
            attachments?: string[];
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateIsDeleted(id: string, dto: UpdateMessageStatusDto): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/message.entity").Message;
    }>;
    deleteMessageAttachment(attachmentId: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
}
