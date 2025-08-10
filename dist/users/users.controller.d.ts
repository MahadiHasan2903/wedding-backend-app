import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enum/users.enum';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dts';
import { BlockUnblockDto } from './dto/block-unblock.dto';
import { LikeDislikeDto } from './dto/like-dislike.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllAdmins(page?: number, pageSize?: number): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getAllUsers(query: SearchUserDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getProfile(user: {
        userId: string;
    }): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./types/user.types").EnrichedUser;
    }>;
    update(user: {
        userId: string;
    }, updateUserDto: UpdateUserDto, rawFiles: {
        profilePicture?: Express.Multer.File[];
        additionalPhotos?: Express.Multer.File[];
    }): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./types/user.types").EnrichedUser;
    }>;
    updateAccountStatus(user: {
        userId: string;
    }, updateAccountStatusDto: UpdateAccountStatusDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber?: string;
            bio?: string;
            motherTongue?: string;
            dateOfBirth?: Date;
            gender?: import("./enum/users.enum").Gender;
            nationality?: string;
            country?: string;
            city?: string;
            maritalStatus?: import("./enum/users.enum").MaritalStatus;
            profilePicture: string | null;
            additionalPhotos?: string[];
            blockedUsers?: string[];
            likedUsers?: string[];
            socialMediaLinks: {
                name: string;
                link: string;
            }[];
            preferredLanguages?: string[];
            userRole: UserRole;
            accountStatus: import("./enum/users.enum").AccountStatus;
            purchasedMembership: string;
            timeZone?: string;
            highestEducation?: string;
            institutionName?: string;
            profession?: string;
            companyName?: string;
            monthlyIncome?: number;
            incomeCurrency?: import("./enum/users.enum").Currency;
            religion?: import("./enum/users.enum").Religion;
            politicalView?: import("./enum/users.enum").PoliticalView;
            livingArrangement?: import("./enum/users.enum").LivingArrangement;
            familyMemberCount?: number;
            interestedInGender?: string;
            lookingFor?: import("./enum/users.enum").LookingFor;
            preferredAgeRange?: string;
            preferredNationality?: string[];
            religionPreference?: import("./enum/users.enum").ReligionPreference;
            politicalPreference?: string;
            partnerExpectations?: string;
            weightKg?: number;
            heightCm?: number;
            bodyType?: import("./enum/users.enum").BodyType;
            drinkingHabit?: import("./enum/users.enum").DrinkingHabit;
            smokingHabit?: import("./enum/users.enum").SmokingHabit;
            healthCondition?: import("./enum/users.enum").HealthCondition;
            hasPet?: boolean;
            dietaryPreference?: import("./enum/users.enum").DietaryPreference;
            children?: number;
            familyBackground?: import("./enum/users.enum").FamilyBackground;
            culturalPractices?: import("./enum/users.enum").CulturalPractices;
            astrologicalSign?: import("./enum/users.enum").AstrologicalSign;
            loveLanguage?: import("./enum/users.enum").LoveLanguage;
            favoriteQuote?: string;
            profileVisibility?: import("./enum/users.enum").PrivacySettings;
            photoVisibility?: import("./enum/users.enum").PrivacySettings;
            messageAvailability?: import("./enum/users.enum").PrivacySettings;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateUserRole(updateUserRoleDto: UpdateUserRoleDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber?: string;
            bio?: string;
            motherTongue?: string;
            dateOfBirth?: Date;
            gender?: import("./enum/users.enum").Gender;
            nationality?: string;
            country?: string;
            city?: string;
            maritalStatus?: import("./enum/users.enum").MaritalStatus;
            profilePicture: string | null;
            additionalPhotos?: string[];
            blockedUsers?: string[];
            likedUsers?: string[];
            socialMediaLinks: {
                name: string;
                link: string;
            }[];
            preferredLanguages?: string[];
            userRole: UserRole;
            accountStatus: import("./enum/users.enum").AccountStatus;
            purchasedMembership: string;
            timeZone?: string;
            highestEducation?: string;
            institutionName?: string;
            profession?: string;
            companyName?: string;
            monthlyIncome?: number;
            incomeCurrency?: import("./enum/users.enum").Currency;
            religion?: import("./enum/users.enum").Religion;
            politicalView?: import("./enum/users.enum").PoliticalView;
            livingArrangement?: import("./enum/users.enum").LivingArrangement;
            familyMemberCount?: number;
            interestedInGender?: string;
            lookingFor?: import("./enum/users.enum").LookingFor;
            preferredAgeRange?: string;
            preferredNationality?: string[];
            religionPreference?: import("./enum/users.enum").ReligionPreference;
            politicalPreference?: string;
            partnerExpectations?: string;
            weightKg?: number;
            heightCm?: number;
            bodyType?: import("./enum/users.enum").BodyType;
            drinkingHabit?: import("./enum/users.enum").DrinkingHabit;
            smokingHabit?: import("./enum/users.enum").SmokingHabit;
            healthCondition?: import("./enum/users.enum").HealthCondition;
            hasPet?: boolean;
            dietaryPreference?: import("./enum/users.enum").DietaryPreference;
            children?: number;
            familyBackground?: import("./enum/users.enum").FamilyBackground;
            culturalPractices?: import("./enum/users.enum").CulturalPractices;
            astrologicalSign?: import("./enum/users.enum").AstrologicalSign;
            loveLanguage?: import("./enum/users.enum").LoveLanguage;
            favoriteQuote?: string;
            profileVisibility?: import("./enum/users.enum").PrivacySettings;
            photoVisibility?: import("./enum/users.enum").PrivacySettings;
            messageAvailability?: import("./enum/users.enum").PrivacySettings;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getLikedUsers(user: {
        userId: string;
    }, page?: number, pageSize?: number): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    updateLikedUser(user: {
        userId: string;
    }, dto: LikeDislikeDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: string[];
    }>;
    checkIfUserLiked(user: {
        userId: string;
    }, targetUserId: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            isLiked: boolean;
        };
    }>;
    getBlockedUsers(user: {
        userId: string;
    }, page?: number, pageSize?: number, name?: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    updateBlockedUser(user: {
        userId: string;
    }, dto: BlockUnblockDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: string[];
    }>;
    checkIfUserBlocked(user: {
        userId: string;
    }, targetUserId: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            isBlocked: boolean;
        };
    }>;
    getUserById(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./types/user.types").EnrichedUser;
    }>;
    updateUserAccountStatus(id: string, updateAccountStatusDto: UpdateAccountStatusDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber?: string;
            bio?: string;
            motherTongue?: string;
            dateOfBirth?: Date;
            gender?: import("./enum/users.enum").Gender;
            nationality?: string;
            country?: string;
            city?: string;
            maritalStatus?: import("./enum/users.enum").MaritalStatus;
            profilePicture: string | null;
            additionalPhotos?: string[];
            blockedUsers?: string[];
            likedUsers?: string[];
            socialMediaLinks: {
                name: string;
                link: string;
            }[];
            preferredLanguages?: string[];
            userRole: UserRole;
            accountStatus: import("./enum/users.enum").AccountStatus;
            purchasedMembership: string;
            timeZone?: string;
            highestEducation?: string;
            institutionName?: string;
            profession?: string;
            companyName?: string;
            monthlyIncome?: number;
            incomeCurrency?: import("./enum/users.enum").Currency;
            religion?: import("./enum/users.enum").Religion;
            politicalView?: import("./enum/users.enum").PoliticalView;
            livingArrangement?: import("./enum/users.enum").LivingArrangement;
            familyMemberCount?: number;
            interestedInGender?: string;
            lookingFor?: import("./enum/users.enum").LookingFor;
            preferredAgeRange?: string;
            preferredNationality?: string[];
            religionPreference?: import("./enum/users.enum").ReligionPreference;
            politicalPreference?: string;
            partnerExpectations?: string;
            weightKg?: number;
            heightCm?: number;
            bodyType?: import("./enum/users.enum").BodyType;
            drinkingHabit?: import("./enum/users.enum").DrinkingHabit;
            smokingHabit?: import("./enum/users.enum").SmokingHabit;
            healthCondition?: import("./enum/users.enum").HealthCondition;
            hasPet?: boolean;
            dietaryPreference?: import("./enum/users.enum").DietaryPreference;
            children?: number;
            familyBackground?: import("./enum/users.enum").FamilyBackground;
            culturalPractices?: import("./enum/users.enum").CulturalPractices;
            astrologicalSign?: import("./enum/users.enum").AstrologicalSign;
            loveLanguage?: import("./enum/users.enum").LoveLanguage;
            favoriteQuote?: string;
            profileVisibility?: import("./enum/users.enum").PrivacySettings;
            photoVisibility?: import("./enum/users.enum").PrivacySettings;
            messageAvailability?: import("./enum/users.enum").PrivacySettings;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    deleteAdditionalPhoto(user: {
        userId: string;
    }, photoId: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
}
