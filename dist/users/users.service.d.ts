import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { MediaService } from 'src/media/media.service';
import { AccountStatus, UserRole } from './enum/users.enum';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { FiltersOptions } from './types/user.types';
import { BlockUnblockDto } from './dto/block-unblock.dto';
import { LikeDislikeDto } from './dto/like-dislike.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly mediaRepository;
    private readonly mediaService;
    constructor(usersRepository: UserRepository, mediaRepository: MediaRepository, mediaService: MediaService);
    findUserById(id: string): Promise<import("./types/user.types").EnrichedUser>;
    findUsersWithRelatedMediaPaginated(page?: number, pageSize?: number, sort?: string, filters?: FiltersOptions): Promise<{
        items: (Omit<import("./entities/user.entity").User, "password" | "profilePicture" | "additionalPhotos" | "purchasedMembership"> & {
            profilePicture: import("../media/entities/media.entity").Media | null;
            additionalPhotos: import("../media/entities/media.entity").Media[];
            purchasedMembership: import("./types/user-ms-purchase.types").PurchasedMembershipInfo | null;
        })[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, files?: {
        profilePicture?: Express.Multer.File;
        additionalPhotos?: Express.Multer.File[];
    }): Promise<import("./types/user.types").EnrichedUser>;
    updateAccountStatus(userId: string, accountStatus: AccountStatus): Promise<import("./entities/user.entity").User>;
    updateUserRole(userId: string, userRole: UserRole): Promise<import("./entities/user.entity").User>;
    findUsersByRolePaginated(role: UserRole, page?: number, pageSize?: number): Promise<{
        items: (Omit<import("./entities/user.entity").User, "password" | "profilePicture" | "additionalPhotos" | "purchasedMembership"> & {
            profilePicture: import("../media/entities/media.entity").Media | null;
            additionalPhotos: import("../media/entities/media.entity").Media[];
            purchasedMembership: import("./types/user-ms-purchase.types").PurchasedMembershipInfo | null;
        })[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    findLikedUsersPaginated(userId: string, page?: number, pageSize?: number): Promise<{
        items: (Omit<import("./entities/user.entity").User, "password" | "profilePicture" | "additionalPhotos" | "purchasedMembership"> & {
            profilePicture: import("../media/entities/media.entity").Media | null;
            additionalPhotos: import("../media/entities/media.entity").Media[];
            purchasedMembership: import("./types/user-ms-purchase.types").PurchasedMembershipInfo | null;
        })[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    updateLikedUser(userId: string, dto: LikeDislikeDto): Promise<string[]>;
    hasUserLikedTarget(userId: string, targetUserId: string): Promise<boolean>;
    findBlockedUsersPaginated(userId: string, page?: number, pageSize?: number, name?: string): Promise<{
        items: (Omit<import("./entities/user.entity").User, "password" | "profilePicture" | "additionalPhotos" | "purchasedMembership"> & {
            profilePicture: import("../media/entities/media.entity").Media | null;
            additionalPhotos: import("../media/entities/media.entity").Media[];
            purchasedMembership: import("./types/user-ms-purchase.types").PurchasedMembershipInfo | null;
        })[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    updateBlockedUser(userId: string, dto: BlockUnblockDto): Promise<string[]>;
    hasUserBlockedTarget(userId: string, targetUserId: string): Promise<boolean>;
    removeAdditionalPhoto(userId: string, mediaId: string): Promise<void>;
}
