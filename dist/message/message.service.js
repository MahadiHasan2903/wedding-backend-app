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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const message_enum_1 = require("./enum/message.enum");
const media_service_1 = require("../media/media.service");
const message_repository_1 = require("./repositories/message.repository");
const media_repository_1 = require("../media/repositories/media.repository");
const google_translate_service_1 = require("./translation/google-translate.service");
const conversation_repository_1 = require("../conversation/repositories/conversation.repository");
const typeorm_1 = require("typeorm");
let MessageService = class MessageService {
    messageRepository;
    conversationRepository;
    googleTranslateService;
    mediaRepository;
    mediaService;
    constructor(messageRepository, conversationRepository, googleTranslateService, mediaRepository, mediaService) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.googleTranslateService = googleTranslateService;
        this.mediaRepository = mediaRepository;
        this.mediaService = mediaService;
    }
    async prepareMessageContent(message, needsTranslation) {
        if (!message) {
            throw new Error('Message is required');
        }
        if (needsTranslation) {
            const translations = await this.googleTranslateService.translateMessage(message);
            return {
                originalText: message,
                sourceLanguage: translations.originalLanguage,
                translationEn: translations.translationEn,
                translationFr: translations.translationFr,
                translationEs: translations.translationEs,
            };
        }
        return {
            originalText: message,
            sourceLanguage: message_enum_1.Language.EN,
            translationEn: message,
            translationFr: '',
            translationEs: '',
        };
    }
    async createMessage(dto, files) {
        let messageContent;
        if (dto.message) {
            messageContent = await this.prepareMessageContent(dto.message, dto.needsTranslation || false);
        }
        let attachmentIds = [];
        if (files?.attachments?.length) {
            const mediaList = await Promise.all(files.attachments.map((file) => this.mediaService.handleUpload(file, 'conversation_attachments', `users/${dto.senderId}/conversation-attachments`)));
            attachmentIds = mediaList.map((media) => media.id);
        }
        else if (dto.attachments?.length) {
            attachmentIds = dto.attachments;
        }
        const newMessage = this.messageRepository.create({
            ...dto,
            message: messageContent,
            attachments: attachmentIds.length > 0 ? attachmentIds : undefined,
        });
        const savedMessage = await this.messageRepository.save(newMessage);
        await this.conversationRepository.update(dto.conversationId, {
            lastMessageId: savedMessage.id,
            lastMessage: dto.message ?? '[attachment]',
            senderId: dto.senderId,
            receiverId: dto.receiverId,
            createdAt: new Date(),
        });
        const mediaItems = attachmentIds.length
            ? await this.mediaRepository.find({
                where: { id: (0, typeorm_1.In)(attachmentIds) },
            })
            : [];
        let repliedMessage = null;
        if (dto.repliedToMessage) {
            repliedMessage = await this.messageRepository.findOne({
                where: { id: dto.repliedToMessage },
            });
        }
        return {
            ...savedMessage,
            attachments: mediaItems,
            ...(repliedMessage ? { repliedToMessage: repliedMessage } : {}),
        };
    }
    async findById(id) {
        const message = await this.messageRepository.findOne({ where: { id } });
        if (!message) {
            return null;
        }
        let fullAttachments = [];
        if (message.attachments && message.attachments.length > 0) {
            const attachmentsWithNulls = await Promise.all(message.attachments.map((attachmentId) => this.mediaRepository.findById(attachmentId)));
            fullAttachments = attachmentsWithNulls.filter((media) => media !== null);
        }
        return {
            ...message,
            attachments: fullAttachments,
        };
    }
    async findByConversationId(conversationId, { page, pageSize, sort }) {
        const [sortField, sortOrder] = sort.split(',');
        const isDesc = sortOrder.toUpperCase() === 'DESC';
        const [items, totalItems] = await this.messageRepository.findAndCount({
            where: { conversationId },
            order: {
                [sortField]: isDesc ? 'DESC' : 'ASC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const enrichedMessages = await Promise.all(items.map(async (message) => {
            let fullAttachments = [];
            if (message.attachments?.length) {
                fullAttachments = await Promise.all(message.attachments.map((id) => this.mediaRepository.findById(id)));
            }
            let repliedToMessage = null;
            if (message.repliedToMessage) {
                repliedToMessage = await this.messageRepository.findOne({
                    where: { id: message.repliedToMessage },
                });
            }
            return {
                ...message,
                attachments: fullAttachments,
                repliedToMessage,
            };
        }));
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            items: enrichedMessages,
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
    async updateMessageContent(id, message, needsTranslation = false) {
        const translatedContent = await this.prepareMessageContent(message, needsTranslation);
        const updatedMessage = await this.messageRepository.updateMessageContent(id, translatedContent);
        let repliedMessage = null;
        if (updatedMessage.repliedToMessage) {
            repliedMessage = await this.messageRepository.findOne({
                where: { id: updatedMessage.repliedToMessage },
            });
        }
        return {
            ...updatedMessage,
            repliedToMessage: repliedMessage,
        };
    }
    async updateIsDeleted(id, dto) {
        return this.messageRepository.updateMessageDeletionStatus(id, dto.isDeleted);
    }
    async removeAttachment(mediaId) {
        const media = await this.mediaRepository.findOne({
            where: { id: mediaId },
        });
        if (!media) {
            throw new common_1.NotFoundException(`Attachment with id ${mediaId} not found`);
        }
        const messagesWithAttachment = await this.messageRepository
            .createQueryBuilder('message')
            .where(':mediaId = ANY(message.attachments)', { mediaId })
            .getMany();
        for (const message of messagesWithAttachment) {
            if (!message.attachments)
                continue;
            message.attachments = message.attachments.filter((id) => id !== mediaId);
            await this.messageRepository.save(message);
        }
        await this.mediaService.deleteMediaById(mediaId);
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_repository_1.MessageRepository,
        conversation_repository_1.ConversationRepository,
        google_translate_service_1.GoogleTranslateService,
        media_repository_1.MediaRepository,
        media_service_1.MediaService])
], MessageService);
//# sourceMappingURL=message.service.js.map