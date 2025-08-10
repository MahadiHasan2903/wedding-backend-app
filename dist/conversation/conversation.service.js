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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const user_repository_1 = require("../users/repositories/user.repository");
const conversation_repository_1 = require("./repositories/conversation.repository");
const message_repository_1 = require("../message/repositories/message.repository");
let ConversationService = class ConversationService {
    userService;
    userRepository;
    messageRepository;
    conversationRepository;
    constructor(userService, userRepository, messageRepository, conversationRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }
    async createConversation(dto) {
        const { senderId, receiverId } = dto;
        if (!receiverId) {
            throw new common_1.BadRequestException('receiverId is required to create a conversation.');
        }
        const existingConversation = await this.conversationRepository.findOne({
            where: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        });
        if (existingConversation) {
            return existingConversation;
        }
        const conversation = this.conversationRepository.create(dto);
        return await this.conversationRepository.save(conversation);
    }
    async findBySenderId(senderId, { page, pageSize, sort }) {
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
    async findMyConversation(userId, { page, pageSize, sort }) {
        const [sortField, sortOrder] = sort.split(',');
        const isDesc = sortOrder.toUpperCase() === 'DESC';
        const currentUser = await this.userRepository.findOne({
            where: { id: userId },
            select: ['blockedUsers'],
        });
        const blockedUsers = currentUser?.blockedUsers ?? [];
        const [items, totalItems] = await this.conversationRepository.findAndCount({
            where: [{ senderId: userId }, { receiverId: userId }],
            order: {
                [sortField]: isDesc ? 'DESC' : 'ASC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const filteredConversations = items.filter((conversation) => !blockedUsers.includes(conversation.senderId) &&
            !blockedUsers.includes(conversation.receiverId));
        const enrichedConversations = await Promise.all(filteredConversations.map(async (conversation) => {
            const sender = await this.userService.findUserById(conversation.senderId);
            const receiver = await this.userService.findUserById(conversation.receiverId);
            let fullLastMessage = null;
            if (conversation.lastMessageId) {
                fullLastMessage = await this.messageRepository.findById(conversation.lastMessageId);
            }
            return {
                ...conversation,
                sender,
                receiver,
                lastMessage: fullLastMessage,
            };
        }));
        const filteredTotalItems = totalItems - (items.length - filteredConversations.length);
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
    async findByConversationId(id) {
        const conversation = await this.conversationRepository.findByConversationId(id);
        if (!conversation) {
            throw new common_1.NotFoundException('Conversation not found');
        }
        const sender = await this.userService.findUserById(conversation.senderId);
        const receiver = await this.userService.findUserById(conversation.receiverId);
        return {
            ...conversation,
            sender,
            receiver,
        };
    }
    async updateLastMessage(id, dto) {
        return await this.conversationRepository.updateLastMessage(id, dto.lastMessageId, dto.lastMessage);
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        user_repository_1.UserRepository,
        message_repository_1.MessageRepository,
        conversation_repository_1.ConversationRepository])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map