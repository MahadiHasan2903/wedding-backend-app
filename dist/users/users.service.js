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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repositories/user.repository");
const media_service_1 = require("../media/media.service");
const users_enum_1 = require("./enum/users.enum");
const typeorm_1 = require("typeorm");
const media_repository_1 = require("../media/repositories/media.repository");
let UsersService = class UsersService {
    usersRepository;
    mediaRepository;
    mediaService;
    constructor(usersRepository, mediaRepository, mediaService) {
        this.usersRepository = usersRepository;
        this.mediaRepository = mediaRepository;
        this.mediaService = mediaService;
    }
    async findUserById(id) {
        const user = await this.usersRepository.findByIdWithoutPassword(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        return this.usersRepository.enrichUserRelations(user);
    }
    async findUsersWithRelatedMediaPaginated(page = 1, pageSize = 10, sort = 'id,DESC', filters = {}) {
        const { items, totalItems, itemsPerPage, currentPage, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, } = await this.usersRepository.findAllPaginated(page, pageSize, sort, filters);
        const enrichedItems = await Promise.all(items.map((user) => this.usersRepository.enrichUserRelations(user)));
        return {
            items: enrichedItems,
            totalItems,
            itemsPerPage,
            currentPage,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
    async update(id, updateUserDto, files) {
        const user = await this.usersRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        if (files?.profilePicture) {
            if (user.profilePicture) {
                await this.mediaService.deleteMediaById(user.profilePicture);
            }
            const media = await this.mediaService.handleUpload(files.profilePicture, `user_profile`, `users/${id}/user-profile`);
            user.profilePicture = media.id;
        }
        else if (updateUserDto.profilePicture) {
            user.profilePicture = updateUserDto.profilePicture;
        }
        if (files?.additionalPhotos?.length) {
            const mediaList = await Promise.all(files.additionalPhotos.map((file) => this.mediaService.handleUpload(file, `user_gallery`, `users/${id}/user-gallery`)));
            const uploadedIds = mediaList.map((media) => media.id);
            const existingIds = user.additionalPhotos || [];
            user.additionalPhotos = Array.from(new Set([...existingIds, ...uploadedIds]));
        }
        else if (updateUserDto.additionalPhotos?.length) {
            const photos = await this.mediaRepository.find({
                where: {
                    id: (0, typeorm_1.In)(updateUserDto.additionalPhotos),
                },
            });
            if (photos.length !== updateUserDto.additionalPhotos.length) {
                throw new common_1.NotFoundException('One or more additional photo IDs are invalid');
            }
            user.additionalPhotos = updateUserDto.additionalPhotos;
        }
        const { profilePicture, additionalPhotos, ...rest } = updateUserDto;
        this.usersRepository.merge(user, rest);
        const savedUser = await this.usersRepository.save(user);
        const safeUser = (({ password, ...rest }) => rest)(savedUser);
        return this.usersRepository.enrichUserRelations(safeUser);
    }
    async updateAccountStatus(userId, accountStatus) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.accountStatus = accountStatus;
        return this.usersRepository.save(user);
    }
    async updateUserRole(userId, userRole) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        user.userRole = userRole;
        return this.usersRepository.save(user);
    }
    async findUsersByRolePaginated(role, page = 1, pageSize = 10) {
        const [items, totalItems] = await this.usersRepository.findAndCount({
            where: { userRole: role },
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });
        const enrichedItems = await Promise.all(items.map((user) => this.usersRepository.enrichUserRelations(user)));
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            items: enrichedItems,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
        };
    }
    async findLikedUsersPaginated(userId, page = 1, pageSize = 10) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const likedUserIds = user.likedUsers ?? [];
        if (likedUserIds.length === 0) {
            return {
                items: [],
                totalItems: 0,
                itemsPerPage: pageSize,
                currentPage: page,
                totalPages: 0,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            };
        }
        const totalItems = likedUserIds.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedIds = likedUserIds.slice(start, end);
        const likedUsers = await this.usersRepository.find({
            where: { id: (0, typeorm_1.In)(paginatedIds) },
        });
        const safeUsers = likedUsers.map(({ password, ...rest }) => rest);
        const enrichedItems = await Promise.all(safeUsers.map((user) => this.usersRepository.enrichUserRelations(user)));
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            items: enrichedItems,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
        };
    }
    async updateLikedUser(userId, dto) {
        const { likedUserId, status } = dto;
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        if (!user.likedUsers) {
            user.likedUsers = [];
        }
        if (status === users_enum_1.LikeStatus.LIKE) {
            if (!user.likedUsers.includes(likedUserId)) {
                user.likedUsers.push(likedUserId);
            }
        }
        else if (status === users_enum_1.LikeStatus.DISLIKE) {
            user.likedUsers = user.likedUsers.filter((id) => id !== likedUserId);
        }
        await this.usersRepository.save(user);
        return user.likedUsers;
    }
    async hasUserLikedTarget(userId, targetUserId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['likedUsers'],
        });
        if (!user) {
            return false;
        }
        return user.likedUsers?.includes(targetUserId) ?? false;
    }
    async findBlockedUsersPaginated(userId, page = 1, pageSize = 10, name) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const blockedUserIds = user.blockedUsers ?? [];
        if (blockedUserIds.length === 0) {
            return {
                items: [],
                totalItems: 0,
                itemsPerPage: pageSize,
                currentPage: page,
                totalPages: 0,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            };
        }
        const queryBuilder = this.usersRepository
            .createQueryBuilder('user')
            .where('user.id IN (:...blockedUserIds)', { blockedUserIds });
        if (name) {
            queryBuilder.andWhere(`(LOWER(user.firstName) LIKE :name OR LOWER(user.lastName) LIKE :name)`, { name: `%${name.toLowerCase()}%` });
        }
        const totalItems = await queryBuilder.getCount();
        const users = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        const safeUsers = users.map(({ password, ...rest }) => rest);
        const enrichedItems = await Promise.all(safeUsers.map((user) => this.usersRepository.enrichUserRelations(user)));
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            items: enrichedItems,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
        };
    }
    async updateBlockedUser(userId, dto) {
        const { blockedUserId, status } = dto;
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        if (!user.blockedUsers) {
            user.blockedUsers = [];
        }
        if (status === users_enum_1.BlockStatus.BLOCK) {
            if (user.blockedUsers.includes(blockedUserId)) {
                return user.blockedUsers;
            }
            user.blockedUsers.push(blockedUserId);
        }
        else if (status === users_enum_1.BlockStatus.UNBLOCK) {
            user.blockedUsers = user.blockedUsers.filter((id) => id !== blockedUserId);
        }
        await this.usersRepository.save(user);
        return user.blockedUsers;
    }
    async hasUserBlockedTarget(userId, targetUserId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['blockedUsers'],
        });
        if (!user) {
            return false;
        }
        return user.blockedUsers?.includes(targetUserId) ?? false;
    }
    async removeAdditionalPhoto(userId, mediaId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${userId} not found`);
        }
        const currentPhotos = user.additionalPhotos || [];
        if (!currentPhotos.includes(mediaId)) {
            throw new common_1.NotFoundException(`Media ID ${mediaId} is not in user's additional photos`);
        }
        user.additionalPhotos = currentPhotos.filter((id) => id !== mediaId);
        await this.usersRepository.save(user);
        await this.mediaService.deleteMediaById(mediaId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        media_repository_1.MediaRepository,
        media_service_1.MediaService])
], UsersService);
//# sourceMappingURL=users.service.js.map