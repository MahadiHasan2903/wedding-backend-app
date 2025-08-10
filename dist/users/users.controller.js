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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_enum_1 = require("./enum/users.enum");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const helpers_1 = require("../utils/helpers");
const platform_express_1 = require("@nestjs/platform-express");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const update_account_status_dto_1 = require("./dto/update-account-status.dto");
const search_user_dto_1 = require("./dto/search-user.dto");
const update_user_role_dts_1 = require("./dto/update-user-role.dts");
const block_unblock_dto_1 = require("./dto/block-unblock.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const like_dislike_dto_1 = require("./dto/like-dislike.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllAdmins(page = 1, pageSize = 10) {
        try {
            const result = await this.usersService.findUsersByRolePaginated(users_enum_1.UserRole.ADMIN, Number(page), Number(pageSize));
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Admin users fetched successfully',
                data: result,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to fetch admin users',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllUsers(query) {
        try {
            const { name, page, pageSize, sort, age, height, weight, joined, monthlyIncome, lookingFor, religion, politicalView, country, city, languageSpoken, education, profession, familyMember, maritalStatus, hasChildren, hasPet, dietaryPreference, smokingHabit, drinkingHabit, accountType, } = query;
            const data = await this.usersService.findUsersWithRelatedMediaPaginated(page, pageSize, sort, {
                name,
                age,
                height,
                weight,
                joined,
                monthlyIncome,
                lookingFor,
                religion,
                politicalView,
                country,
                city,
                languageSpoken,
                education,
                profession,
                familyMember,
                maritalStatus,
                hasChildren,
                hasPet,
                dietaryPreference,
                smokingHabit,
                drinkingHabit,
                accountType,
            });
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Users retrieved successfully',
                data,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to retrieve users',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getProfile(user) {
        try {
            const foundUser = await this.usersService.findUserById(user.userId);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Profile retrieved successfully',
                data: foundUser,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to retrieve profile',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(user, updateUserDto, rawFiles) {
        const files = {
            profilePicture: rawFiles.profilePicture?.[0],
            additionalPhotos: rawFiles.additionalPhotos || [],
        };
        try {
            const updatedUser = await this.usersService.update(user.userId, updateUserDto, files);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'User updated successfully',
                data: updatedUser,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update user',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateAccountStatus(user, updateAccountStatusDto) {
        try {
            const updatedUser = await this.usersService.updateAccountStatus(user.userId, updateAccountStatusDto.accountStatus);
            const { password, ...safeUser } = updatedUser;
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Account status updated successfully',
                data: safeUser,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update account status',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateUserRole(updateUserRoleDto) {
        try {
            const updatedUser = await this.usersService.updateUserRole(updateUserRoleDto.userId, updateUserRoleDto.userRole);
            const { password, ...safeUser } = updatedUser;
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'User role updated successfully',
                data: safeUser,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update user role',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getLikedUsers(user, page = 1, pageSize = 10) {
        try {
            const result = await this.usersService.findLikedUsersPaginated(user.userId, Number(page), Number(pageSize));
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Liked users retrieved successfully',
                data: result,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to fetch liked users',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateLikedUser(user, dto) {
        try {
            const updatedLikedUsers = await this.usersService.updateLikedUser(user.userId, dto);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: dto.status === users_enum_1.LikeStatus.LIKE
                    ? 'User liked successfully'
                    : 'User disliked successfully',
                data: updatedLikedUsers,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update liked users',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async checkIfUserLiked(user, targetUserId) {
        if (!targetUserId) {
            throw new common_1.BadRequestException('Target user ID is required');
        }
        try {
            const isLiked = await this.usersService.hasUserLikedTarget(user.userId, targetUserId);
            console.log(isLiked);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Liked status checked for user ${targetUserId}`,
                data: { isLiked },
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to check liked status',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getBlockedUsers(user, page = 1, pageSize = 10, name) {
        try {
            const result = await this.usersService.findBlockedUsersPaginated(user.userId, Number(page), Number(pageSize), name);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Blocked users retrieved successfully',
                data: result,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to fetch blocked users',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateBlockedUser(user, dto) {
        try {
            const updatedBlockedUsers = await this.usersService.updateBlockedUser(user.userId, dto);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: dto.status === users_enum_1.BlockStatus.BLOCK
                    ? 'User blocked successfully'
                    : 'User unblocked successfully',
                data: updatedBlockedUsers,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update blocked users',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async checkIfUserBlocked(user, targetUserId) {
        if (!targetUserId) {
            throw new common_1.BadRequestException('Target user ID is required');
        }
        try {
            const isBlocked = await this.usersService.hasUserBlockedTarget(user.userId, targetUserId);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: `Blocked status checked for user ${targetUserId}`,
                data: { isBlocked },
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to check blocked status',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserById(id) {
        try {
            const foundUser = await this.usersService.findUserById(id);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'User retrieved successfully',
                data: foundUser,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to retrieve user',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateUserAccountStatus(id, updateAccountStatusDto) {
        try {
            const updatedUser = await this.usersService.updateAccountStatus(id, updateAccountStatusDto.accountStatus);
            const { password, ...safeUser } = updatedUser;
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'User account status updated successfully',
                data: safeUser,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update user account status',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteAdditionalPhoto(user, photoId) {
        try {
            await this.usersService.removeAdditionalPhoto(user.userId, photoId);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Photo deleted successfully',
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
                message: 'Failed to delete photo',
                error: sanitizedError,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('admins'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllAdmins", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_user_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('update-profile'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'additionalPhotos', maxCount: 20 },
    ])),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('profile/account-status'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAccountStatus", null);
__decorate([
    (0, common_1.Patch)('update-role'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_role_dts_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Get)('liked-users'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getLikedUsers", null);
__decorate([
    (0, common_1.Patch)('liked-users/update-status'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, like_dislike_dto_1.LikeDislikeDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateLikedUser", null);
__decorate([
    (0, common_1.Get)('liked-users/check/:targetUserId'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('targetUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkIfUserLiked", null);
__decorate([
    (0, common_1.Get)('blocked-users'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getBlockedUsers", null);
__decorate([
    (0, common_1.Patch)('blocked-users/update-status'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, block_unblock_dto_1.BlockUnblockDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateBlockedUser", null);
__decorate([
    (0, common_1.Get)('blocked-users/check/:targetUserId'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('targetUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkIfUserBlocked", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)(':id/account-status'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_account_status_dto_1.UpdateAccountStatusDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserAccountStatus", null);
__decorate([
    (0, common_1.Delete)('photo/:photoId'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAdditionalPhoto", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('v1/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map