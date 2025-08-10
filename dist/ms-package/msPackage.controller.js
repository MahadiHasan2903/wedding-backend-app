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
exports.MsPackageController = void 0;
const common_1 = require("@nestjs/common");
const create_ms_package_dto_1 = require("./dto/create-ms-package.dto");
const update_ms_package_dto_1 = require("./dto/update-ms-package.dto");
const helpers_1 = require("../utils/helpers");
const msPackage_service_1 = require("./msPackage.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
const public_decorator_1 = require("../common/decorators/public.decorator");
let MsPackageController = class MsPackageController {
    msPackageService;
    constructor(msPackageService) {
        this.msPackageService = msPackageService;
    }
    async getAll() {
        try {
            const allMsPackages = await this.msPackageService.findAll();
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Packages retrieved successfully',
                data: allMsPackages,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to retrieve packages',
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOneById(id) {
        try {
            const packageDetails = await this.msPackageService.findOne(+id);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Package retrieved successfully`,
                data: packageDetails,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                success: false,
                message: `Failed to retrieve package with id ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async create(createMsPackageDto) {
        try {
            const data = await this.msPackageService.create(createMsPackageDto);
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                message: 'Package created successfully',
                data,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to create package',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, updateMsPackageDto) {
        try {
            const data = await this.msPackageService.update(+id, updateMsPackageDto);
            if (!data) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    success: false,
                    message: `Package with id ${id} not found`,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Package updated successfully`,
                data,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: `Failed to update package with id ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.msPackageService.remove(+id);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Package successfully`,
                data: {},
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: `Failed to delete package with id ${id}`,
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.MsPackageController = MsPackageController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MsPackageController.prototype, "getAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MsPackageController.prototype, "getOneById", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ms_package_dto_1.CreateMsPackageDto]),
    __metadata("design:returntype", Promise)
], MsPackageController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ms_package_dto_1.UpdateMsPackageDto]),
    __metadata("design:returntype", Promise)
], MsPackageController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MsPackageController.prototype, "remove", null);
exports.MsPackageController = MsPackageController = __decorate([
    (0, common_1.Controller)('v1/membership-package'),
    __metadata("design:paramtypes", [msPackage_service_1.MsPackageService])
], MsPackageController);
//# sourceMappingURL=msPackage.controller.js.map