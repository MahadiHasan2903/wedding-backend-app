import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  /**
   * Maps userId to their connected socket ID.
   */
  private activeUsers = new Map<string, string>();

  constructor(private readonly messageService: MessageService) {}

  /**
   * Called once the WebSocket server is initialized.
   * @param server - The Socket.IO server instance.
   */
  afterInit(server: Server) {
    console.log('🚀 WebSocket Server initialized');
  }

  /**
   * Called when a new client connects to the WebSocket server.
   * Registers the user's socket connection using their `userId`.
   * @param client - The connected socket client.
   */
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client.id);
      console.log(`✅ User connected: ${userId} with socket ID: ${client.id}`);
    } else {
      console.log(`⚠️ Client connected without a userId: ${client.id}`);
    }
  }

  /**
   * Called when a client disconnects.
   * Removes their socket mapping from the active users.
   * @param client - The disconnected socket client.
   */
  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.activeUsers.entries()) {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
        console.log(`❌ User disconnected: ${userId}`);
        break;
      }
    }
  }

  /**
   * Handles the 'sendMessage' WebSocket event.
   * Saves a new message and emits it to both sender and receiver.
   * @param data - The message data sent by the client.
   * @returns A confirmation object.
   */
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      conversationId: string;
      replyToMessageId?: string;
      message: string;
    },
  ) {
    const createdMessage = await this.messageService.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversationId: data.conversationId,
      message: data.message,
      replyToMessageId: data.replyToMessageId,
    });

    const senderSocketId = this.activeUsers.get(data.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('newMessage', createdMessage);
    }

    const receiverSocketId = this.activeUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', createdMessage);
    }

    return { success: true, message: '📨 Message successfully sent.' };
  }

  /**
   * Handles the 'editMessage' WebSocket event.
   * Updates a message in the database and emits the updated content to both users.
   * @param data - Data containing messageId, new content, and user IDs.
   * @returns A confirmation object.
   */
  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody()
    data: {
      messageId: string;
      updatedMessage: string;
      senderId: string;
      receiverId: string;
    },
  ) {
    const updatedMessage = await this.messageService.updateMessageContent(
      data.messageId,
      data.updatedMessage,
    );

    const senderSocketId = this.activeUsers.get(data.senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messageEdited', updatedMessage);
    }

    const receiverSocketId = this.activeUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('messageEdited', updatedMessage);
    }

    return { success: true, message: '✏️ Message successfully edited.' };
  }
}
