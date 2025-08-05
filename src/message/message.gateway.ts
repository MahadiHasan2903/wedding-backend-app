import {
  MessageBody,
  OnGatewayInit,
  ConnectedSocket,
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
  private activeUsers = new Map<string, Set<string>>();

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
      if (!this.activeUsers.has(userId)) {
        this.activeUsers.set(userId, new Set());
      }
      this.activeUsers.get(userId)!.add(client.id);
      console.log(`✅ User connected: ${userId} with socket ID: ${client.id}`);

      // Emit only if this is the first connection for this user
      if (this.activeUsers.get(userId)!.size === 1) {
        this.server.emit('userStatusChanged', { userId, isOnline: true });
      }
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
    for (const [userId, socketIds] of this.activeUsers.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        console.log(
          `❌ Socket disconnected for user: ${userId}, socket ID: ${client.id}`,
        );

        if (socketIds.size === 0) {
          this.activeUsers.delete(userId);
          console.log(`❌ User disconnected: ${userId}`);

          // Notify all clients only if no active connections remain for this user
          this.server.emit('userStatusChanged', { userId, isOnline: false });
        }
        break;
      }
    }
  }

  /**
   * Handles the "checkUserOnlineStatus" WebSocket event.
   * When a client emits this event with a user ID, this method checks
   * if that user is currently online (i.e., exists in the activeUsers map),
   * and responds to the requesting client with the user's online status.
   *
   * @param data - An object containing the userId to check.
   * @param client - The WebSocket client that made the request.
   */
  @SubscribeMessage('checkUserOnlineStatus')
  handleCheckUserOnlineStatus(
    @MessageBody() data: { userIdToCheck: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userIdToCheck } = data;
    const isOnline = this.activeUsers.has(userIdToCheck);

    console.log(
      `🧠 [checkUserOnlineStatus] ${userIdToCheck} isOnline: ${isOnline}`,
    );

    client.emit('userStatusChanged', { userId: userIdToCheck, isOnline });
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
      repliedToMessage?: string;
      message: string;
    },
  ) {
    const createdMessage = await this.messageService.createMessage({
      senderId: data.senderId,
      receiverId: data.receiverId,
      conversationId: data.conversationId,
      message: data.message,
      repliedToMessage: data.repliedToMessage,
    });

    // Emit to all sender sockets
    const senderSocketIds = this.activeUsers.get(data.senderId);
    if (senderSocketIds) {
      senderSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit('newMessage', createdMessage);
      });
    }

    // Emit to all receiver sockets
    const receiverSocketIds = this.activeUsers.get(data.receiverId);
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit('newMessage', createdMessage);
      });
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

    // Emit to all sender sockets
    const senderSocketIds = this.activeUsers.get(data.senderId);
    if (senderSocketIds) {
      senderSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit('messageEdited', updatedMessage);
      });
    }

    // Emit to all receiver sockets
    const receiverSocketIds = this.activeUsers.get(data.receiverId);
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        this.server.to(socketId).emit('messageEdited', updatedMessage);
      });
    }

    return { success: true, message: '✏️ Message successfully edited.' };
  }

  /**
   * Handles toggling the deletion status of a message (soft delete).
   *
   * @param data - Contains the ID of the message to update and the desired deletion status.
   * @returns A success/failure response indicating whether the update was processed.
   */
  @SubscribeMessage('toggleMessageDeletion')
  async handleToggleMessageDeletion(
    @MessageBody()
    data: {
      messageId: string;
      isDeleted: boolean;
    },
  ) {
    // Step 1: Fetch message to get senderId and receiverId
    const message = await this.messageService.findById(data.messageId);

    if (!message) {
      return {
        success: false,
        message: `Message with ID ${data.messageId} not found.`,
      };
    }

    // Step 2: Update isDeleted status
    const updatedMessage = await this.messageService.updateIsDeleted(
      data.messageId,
      { isDeleted: data.isDeleted },
    );

    // Step 3: Emit update to sender and receiver sockets
    const userIdsToNotify = [message.senderId, message.receiverId];

    userIdsToNotify.forEach((userId) => {
      const socketIds = this.activeUsers.get(userId);
      if (socketIds) {
        socketIds.forEach((socketId) => {
          this.server
            .to(socketId)
            .emit('messageDeletionToggled', updatedMessage);
        });
      }
    });

    return { success: true, message: '🗑️ Message deletion status updated.' };
  }
}
