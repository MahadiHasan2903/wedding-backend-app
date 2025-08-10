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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const update_message_status_dto_1 = require("./dto/update-message-status.dto");
const helpers_1 = require("../utils/helpers");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
const platform_express_1 = require("@nestjs/platform-express");
const update_message_dto_1 = require("./dto/update-message.dto");
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    async create(dto, files) {
        try {
            const message = await this.messageService.createMessage(dto, files);
            return {
                success: true,
                message: 'Message created successfully',
                status: common_1.HttpStatus.CREATED,
                data: message,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to create message',
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getByConversationId(conversationId, page = 1, pageSize = 10, sort = 'createdAt,DESC') {
        try {
            const messages = await this.messageService.findByConversationId(conversationId, {
                page: Number(page),
                pageSize: Number(pageSize),
                sort,
            });
            return {
                success: true,
                message: 'Messages fetched successfully for conversation',
                status: common_1.HttpStatus.OK,
                data: messages,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: `Failed to fetch messages for conversationId: ${conversationId}`,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getById(id) {
        try {
            const message = await this.messageService.findById(id);
            if (!message) {
                throw new common_1.HttpException({
                    success: false,
                    message: `Message with ID ${id} not found`,
                    status: common_1.HttpStatus.NOT_FOUND,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Message fetched successfully',
                status: common_1.HttpStatus.OK,
                data: message,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: `Failed to fetch message with ID: ${id}`,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateMessageContent(id, body) {
        const { message, needsTranslation } = body;
        try {
            const updatedMessage = await this.messageService.updateMessageContent(id, message, needsTranslation);
            return {
                success: true,
                message: 'Message content updated successfully',
                status: common_1.HttpStatus.OK,
                data: updatedMessage,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `Failed to update message content for ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateIsDeleted(id, dto) {
        try {
            const updated = await this.messageService.updateIsDeleted(id, dto);
            return {
                success: true,
                message: 'Message deletion status updated',
                status: common_1.HttpStatus.OK,
                data: updated,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: `Failed to update isDeleted for message ID: ${id}`,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteMessageAttachment(attachmentId) {
        try {
            await this.messageService.removeAttachment(attachmentId);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Attachment deleted successfully',
                data: {},
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to delete attachment',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'attachments' }])),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('conversation/:conversationId'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('conversationId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getByConversationId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_message_dto_1.UpdateMessageContentDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateMessageContent", null);
__decorate([
    (0, common_1.Patch)(':id/is-deleted'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_message_status_dto_1.UpdateMessageStatusDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "updateIsDeleted", null);
__decorate([
    (0, common_1.Delete)('attachment/:attachmentId'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('attachmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessageAttachment", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('v1/message'),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map