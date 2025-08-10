import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
export declare class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    server: Server;
    private activeUsers;
    constructor(messageService: MessageService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleCheckUserOnlineStatus(data: {
        userIdToCheck: string;
    }, client: Socket): void;
    handleSendMessage(data: {
        senderId: string;
        receiverId: string;
        conversationId: string;
        repliedToMessage?: string;
        message: string;
        attachmentIds?: string[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    handleEditMessage(data: {
        messageId: string;
        updatedMessage: string;
        senderId: string;
        receiverId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    handleToggleMessageDeletion(data: {
        messageId: string;
        isDeleted: boolean;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    handleDeleteAttachment(data: {
        messageId: string;
        attachmentId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
