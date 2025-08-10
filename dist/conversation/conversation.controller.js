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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const conversation_service_1 = require("./conversation.service");
const create_conversation_dto_1 = require("./dto/create-conversation.dto");
const update_last_message_dto_1 = require("./dto/update-last-message.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
const helpers_1 = require("../utils/helpers");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let ConversationController = class ConversationController {
    conversationService;
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    async createConversation(dto) {
        try {
            const conversation = await this.conversationService.createConversation(dto);
            return {
                success: true,
                message: 'Conversation created successfully',
                status: common_1.HttpStatus.CREATED,
                data: conversation,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to create conversation',
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getConversationsBySenderId(page = 1, pageSize = 10, sort = 'updatedAt,DESC', user) {
        try {
            const conversations = await this.conversationService.findMyConversation(user.userId, {
                page: Number(page),
                pageSize: Number(pageSize),
                sort,
            });
            return {
                success: true,
                message: 'Conversations fetched successfully',
                status: common_1.HttpStatus.OK,
                data: conversations,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `Failed to fetch conversations for this account`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getConversationByIdAndSender(id) {
        try {
            const conversation = await this.conversationService.findByConversationId(id);
            return {
                success: true,
                message: 'Conversation fetched successfully',
                status: common_1.HttpStatus.OK,
                data: conversation,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `Failed to fetch conversation with ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateLastMessage(id, dto) {
        try {
            const updatedConversation = await this.conversationService.updateLastMessage(id, dto);
            return {
                success: true,
                message: 'Last message updated successfully',
                status: common_1.HttpStatus.OK,
                data: updatedConversation,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `Failed to update last message for conversation ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getConversationsBySender(senderId, page = 1, pageSize = 10, sort = 'updatedAt,DESC') {
        try {
            const paginatedResult = await this.conversationService.findBySenderId(senderId, {
                page: Number(page),
                pageSize: Number(pageSize),
                sort,
            });
            return {
                success: true,
                message: `Conversations fetched for senderId: ${senderId}`,
                status: common_1.HttpStatus.OK,
                data: paginatedResult,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `Failed to fetch conversations for senderId: ${senderId}`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('my-conversations'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sort')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getConversationsBySenderId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getConversationByIdAndSender", null);
__decorate([
    (0, common_1.Patch)(':id/last-message'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_last_message_dto_1.UpdateLastMessageDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "updateLastMessage", null);
__decorate([
    (0, common_1.Get)('sender/:senderId'),
    __param(0, (0, common_1.Param)('senderId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getConversationsBySender", null);
exports.ConversationController = ConversationController = __decorate([
    (0, common_1.Controller)('v1/conversation'),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map