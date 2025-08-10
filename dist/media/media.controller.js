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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const media_service_1 = require("./media.service");
const helpers_1 = require("../utils/helpers");
const public_decorator_1 = require("../common/decorators/public.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async getAll() {
        try {
            const media = await this.mediaService.getAll();
            return {
                success: true,
                message: 'Media list fetched successfully',
                status: common_1.HttpStatus.OK,
                data: media,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'An unexpected error occurred while retrieving media list',
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id) {
        try {
            const media = await this.mediaService.getOne(id);
            return {
                success: true,
                message: 'Media fetched successfully',
                status: common_1.HttpStatus.OK,
                data: media,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `An unexpected error occurred while retrieving media with ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(id) {
        try {
            await this.mediaService.deleteMediaById(id);
            return {
                success: true,
                message: 'Media deleted successfully',
                status: common_1.HttpStatus.OK,
                data: {},
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: `An unexpected error occurred while deleting media with ID ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async upload(file) {
        if (!file) {
            throw new common_1.HttpException({
                success: false,
                message: 'File is required',
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'No files were uploaded. Please attach the required file(s) before submitting.',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const media = await this.mediaService.handleUpload(file, 'general-collections', 'general-folder');
            return {
                success: true,
                message: 'File uploaded successfully',
                status: common_1.HttpStatus.CREATED,
                data: media,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'An unexpected error occurred while uploading the media',
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async uploadMultipleFiles(files, body) {
        if (!files.files || files.files.length === 0) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                data: [],
                message: 'No files were uploaded. Please select at least one image or video file.',
            };
        }
        try {
            const uploadedMedia = await Promise.all(files.files.map((file) => this.mediaService.handleUpload(file, 'general-collections', 'general-folder')));
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                data: uploadedMedia,
                message: 'Files uploaded successfully.',
            };
        }
        catch (error) {
            console.error('Error uploading files:', error);
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                data: [],
                message: 'Upload failed. Please try again later.',
            };
        }
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "getOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('upload-multiple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'files', maxCount: 10 }])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadMultipleFiles", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('v1/media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map