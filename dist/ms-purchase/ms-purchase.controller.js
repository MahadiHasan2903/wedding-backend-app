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
exports.MsPurchaseController = void 0;
const common_1 = require("@nestjs/common");
const ms_purchase_service_1 = require("./ms-purchase.service");
const helpers_1 = require("../utils/helpers");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_ms_purchase_dto_1 = require("./dto/create-ms-purchase.dto");
let MsPurchaseController = class MsPurchaseController {
    msPurchaseService;
    constructor(msPurchaseService) {
        this.msPurchaseService = msPurchaseService;
    }
    async getMyPurchases(page = 1, pageSize = 10, sort = 'id,DESC', user) {
        try {
            const purchases = await this.msPurchaseService.findByUserId(user.userId, {
                page: Number(page),
                pageSize: Number(pageSize),
                sort,
            });
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Membership purchases fetched for the current user',
                data: purchases,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to fetch membership purchases for current user',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async create(user, createDto) {
        try {
            const purchase = await this.msPurchaseService.createPurchase(user.userId, createDto.msPackageId, createDto.purchasePackageCategory);
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                message: 'Membership purchase created successfully',
                data: purchase,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to create membership purchase',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOne(id) {
        try {
            const purchase = await this.msPurchaseService.findById(id);
            if (!purchase) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    success: false,
                    message: 'Purchase not found',
                    error: 'Invalid purchase ID',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Membership purchase fetched successfully',
                data: purchase,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to fetch membership purchase',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAll(page = 1, pageSize = 10, sort = 'id,DESC') {
        try {
            const purchases = await this.msPurchaseService.findAll({
                page: Number(page),
                pageSize: Number(pageSize),
                sort,
            });
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Membership purchases fetched successfully',
                data: purchases,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to fetch membership purchases',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async delete(id) {
        try {
            const deleted = await this.msPurchaseService.delete(id);
            if (!deleted) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    success: false,
                    message: 'Purchase not found',
                    error: 'Invalid purchase ID',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Purchase deleted successfully',
                data: {},
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to delete purchase',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.MsPurchaseController = MsPurchaseController;
__decorate([
    (0, common_1.Get)('my-purchases'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sort')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MsPurchaseController.prototype, "getMyPurchases", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ms_purchase_dto_1.CreateMsPurchaseDto]),
    __metadata("design:returntype", Promise)
], MsPurchaseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MsPurchaseController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MsPurchaseController.prototype, "getAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MsPurchaseController.prototype, "delete", null);
exports.MsPurchaseController = MsPurchaseController = __decorate([
    (0, common_1.Controller)('v1/membership-purchases'),
    __metadata("design:paramtypes", [ms_purchase_service_1.MsPurchaseService])
], MsPurchaseController);
//# sourceMappingURL=ms-purchase.controller.js.map