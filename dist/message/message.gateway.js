"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const message_service_1 = require("./message.service");
let MessageGateway = class MessageGateway {
    messageService;
    server;
    activeUsers = new Map();
    constructor(messageService) {
        this.messageService = messageService;
    }
    afterInit(server) {
        console.log('🚀 WebSocket Server initialized');
    }
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            if (!this.activeUsers.has(userId)) {
                this.activeUsers.set(userId, new Set());
            }
            this.activeUsers.get(userId).add(client.id);
            console.log(`✅ User connected: ${userId} with socket ID: ${client.id}`);
            if (this.activeUsers.get(userId).size === 1) {
                this.server.emit('userStatusChanged', { userId, isOnline: true });
            }
        }
        else {
            console.log(`⚠️ Client connected without a userId: ${client.id}`);
        }
    }
    handleDisconnect(client) {
        for (const [userId, socketIds] of this.activeUsers.entries()) {
            if (socketIds.has(client.id)) {
                socketIds.delete(client.id);
                console.log(`❌ Socket disconnected for user: ${userId}, socket ID: ${client.id}`);
                if (socketIds.size === 0) {
                    this.activeUsers.delete(userId);
                    console.log(`❌ User disconnected: ${userId}`);
                    this.server.emit('userStatusChanged', { userId, isOnline: false });
                }
                break;
            }
        }
    }
    handleCheckUserOnlineStatus(data, client) {
        const { userIdToCheck } = data;
        const isOnline = this.activeUsers.has(userIdToCheck);
        console.log(`🧠 [checkUserOnlineStatus] ${userIdToCheck} isOnline: ${isOnline}`);
        client.emit('userStatusChanged', { userId: userIdToCheck, isOnline });
    }
    async handleSendMessage(data) {
        const createdMessage = await this.messageService.createMessage({
            senderId: data.senderId,
            receiverId: data.receiverId,
            conversationId: data.conversationId,
            message: data.message,
            repliedToMessage: data.repliedToMessage,
            attachments: data.attachmentIds,
        });
        const senderSocketIds = this.activeUsers.get(data.senderId);
        senderSocketIds?.forEach((socketId) => this.server.to(socketId).emit('newMessage', createdMessage));
        const receiverSocketIds = this.activeUsers.get(data.receiverId);
        receiverSocketIds?.forEach((socketId) => this.server.to(socketId).emit('newMessage', createdMessage));
        return { success: true, message: '📨 Message successfully sent.' };
    }
    async handleEditMessage(data) {
        const updatedMessage = await this.messageService.updateMessageContent(data.messageId, data.updatedMessage);
        const senderSocketIds = this.activeUsers.get(data.senderId);
        if (senderSocketIds) {
            senderSocketIds.forEach((socketId) => {
                this.server.to(socketId).emit('messageEdited', updatedMessage);
            });
        }
        const receiverSocketIds = this.activeUsers.get(data.receiverId);
        if (receiverSocketIds) {
            receiverSocketIds.forEach((socketId) => {
                this.server.to(socketId).emit('messageEdited', updatedMessage);
            });
        }
        return { success: true, message: '✏️ Message successfully edited.' };
    }
    async handleToggleMessageDeletion(data) {
        const message = await this.messageService.findById(data.messageId);
        if (!message) {
            return {
                success: false,
                message: `Message with ID ${data.messageId} not found.`,
            };
        }
        const updatedMessage = await this.messageService.updateIsDeleted(data.messageId, { isDeleted: data.isDeleted });
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
    async handleDeleteAttachment(data) {
        const { messageId, attachmentId } = data;
        if (!messageId || !attachmentId) {
            return {
                success: false,
                message: '❌ Missing required fields: messageId or attachmentId.',
            };
        }
        const message = await this.messageService.findById(messageId);
        if (!message) {
            return {
                success: false,
                message: `❌ Message with ID ${messageId} not found.`,
            };
        }
        await this.messageService.removeAttachment(attachmentId);
        const { senderId, receiverId } = message;
        const userIdsToNotify = [senderId, receiverId];
        userIdsToNotify.forEach((userId) => {
            const socketIds = this.activeUsers.get(userId);
            if (socketIds) {
                socketIds.forEach((socketId) => {
                    this.server.to(socketId).emit('attachmentDeleted', {
                        messageId,
                        attachmentId,
                    });
                });
            }
        });
        return {
            success: true,
            message: '🗑️ Attachment deleted successfully.',
        };
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('checkUserOnlineStatus'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessageGateway.prototype, "handleCheckUserOnlineStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('editMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleEditMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('toggleMessageDeletion'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleToggleMessageDeletion", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteAttachment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleDeleteAttachment", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map