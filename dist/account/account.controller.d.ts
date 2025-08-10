import { HttpStatus } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AccountService } from './account.service';
import { UserRole } from 'src/users/enum/users.enum';
import { CreateAccountDto } from './dto/create-account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { ForgetPasswordConfirmationDto } from './dto/forget-password-confirmation.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    create(createAccountDto: CreateAccountDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            otp?: string | undefined;
        };
    }>;
    confirm(body: ConfirmRegistrationDto): Promise<{
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
            gender?: import("src/users/enum/users.enum").Gender;
            nationality?: string;
            country?: string;
            city?: string;
            maritalStatus?: import("src/users/enum/users.enum").MaritalStatus;
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
            accountStatus: import("src/users/enum/users.enum").AccountStatus;
            purchasedMembership: string;
            timeZone?: string;
            highestEducation?: string;
            institutionName?: string;
            profession?: string;
            companyName?: string;
            monthlyIncome?: number;
            incomeCurrency?: import("src/users/enum/users.enum").Currency;
            religion?: import("src/users/enum/users.enum").Religion;
            politicalView?: import("src/users/enum/users.enum").PoliticalView;
            livingArrangement?: import("src/users/enum/users.enum").LivingArrangement;
            familyMemberCount?: number;
            interestedInGender?: string;
            lookingFor?: import("src/users/enum/users.enum").LookingFor;
            preferredAgeRange?: string;
            preferredNationality?: string[];
            religionPreference?: import("src/users/enum/users.enum").ReligionPreference;
            politicalPreference?: string;
            partnerExpectations?: string;
            weightKg?: number;
            heightCm?: number;
            bodyType?: import("src/users/enum/users.enum").BodyType;
            drinkingHabit?: import("src/users/enum/users.enum").DrinkingHabit;
            smokingHabit?: import("src/users/enum/users.enum").SmokingHabit;
            healthCondition?: import("src/users/enum/users.enum").HealthCondition;
            hasPet?: boolean;
            dietaryPreference?: import("src/users/enum/users.enum").DietaryPreference;
            children?: number;
            familyBackground?: import("src/users/enum/users.enum").FamilyBackground;
            culturalPractices?: import("src/users/enum/users.enum").CulturalPractices;
            astrologicalSign?: import("src/users/enum/users.enum").AstrologicalSign;
            loveLanguage?: import("src/users/enum/users.enum").LoveLanguage;
            favoriteQuote?: string;
            profileVisibility?: import("src/users/enum/users.enum").PrivacySettings;
            photoVisibility?: import("src/users/enum/users.enum").PrivacySettings;
            messageAvailability?: import("src/users/enum/users.enum").PrivacySettings;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    signin(signinDto: SigninDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                phoneNumber: string | null;
                userRole: UserRole;
                accountStatus: import("src/users/enum/users.enum").AccountStatus.ACTIVE | import("src/users/enum/users.enum").AccountStatus.BANNED;
                profilePicture: import("../media/entities/media.entity").Media | null;
                purchasedMembership: import("../users/types/user-ms-purchase.types").PurchasedMembershipInfo | null;
            };
            accessToken: string;
        };
    }>;
    logout(): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
    forgetPasswordRequest(body: {
        email: string;
    }): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            otp?: undefined;
        } | {
            otp: string | undefined;
        };
    }>;
    verifyForgetPasswordOtp(body: {
        email: string;
        otp: string;
    }): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
    resetPassword(body: ForgetPasswordConfirmationDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
    changePassword(user: {
        userId: string;
    }, body: ChangePasswordDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
}
