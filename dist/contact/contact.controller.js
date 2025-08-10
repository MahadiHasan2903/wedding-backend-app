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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const contact_service_1 = require("./contact.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const update_contact_dto_1 = require("./dto/update-contact.dto");
const helpers_1 = require("../utils/helpers");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
const search_contact_submission_dto_1 = require("./dto/search-contact-submission.dto");
let ContactController = class ContactController {
    contactService;
    constructor(contactService) {
        this.contactService = contactService;
    }
    async create(createContactDto) {
        try {
            const contact = await this.contactService.create(createContactDto);
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                message: 'Contact submitted successfully',
                data: contact,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to submit contact',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query) {
        const { page, pageSize, sort } = query;
        try {
            const contacts = await this.contactService.findAll(page, pageSize, sort);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'All contact submissions retrieved',
                data: contacts,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to retrieve contacts',
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const contact = await this.contactService.findOne(id);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Contact details retrieved`,
                data: contact,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                success: false,
                message: `Contact details not found`,
                error: sanitizedError,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async update(id, updateContactDto) {
        try {
            const updated = await this.contactService.update(id, updateContactDto);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Contact with ID ${id} updated`,
                data: updated,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: `Failed to update contact with ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.contactService.remove(id);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Contact deleted successfully`,
                data: {},
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: `Failed to delete contact with ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_contact_submission_dto_1.SearchContactSubmissionDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contact_dto_1.UpdateContactDto]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "remove", null);
exports.ContactController = ContactController = __decorate([
    (0, common_1.Controller)('v1/contacts'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map