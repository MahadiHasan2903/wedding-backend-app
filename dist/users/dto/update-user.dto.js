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
exports.UpdateUserDto = void 0;
const class_validator_1 = require("class-validator");
const users_enum_1 = require("../enum/users.enum");
const class_transformer_1 = require("class-transformer");
const helpers_1 = require("../../utils/helpers");
const membership_package_dto_1 = require("./membership-package.dto");
class SocialMediaLinkDto {
    name;
    link;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialMediaLinkDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialMediaLinkDto.prototype, "link", void 0);
function isSocialMediaLinkArray(value) {
    return (Array.isArray(value) &&
        value.every((item) => {
            if (typeof item !== 'object' || item === null)
                return false;
            const obj = item;
            return typeof obj.name === 'string' && typeof obj.link === 'string';
        }));
}
class UpdateUserDto {
    firstName;
    lastName;
    email;
    phoneNumber;
    password;
    userRole;
    bio;
    dateOfBirth;
    gender;
    nationality;
    country;
    motherTongue;
    city;
    maritalStatus;
    profilePicture;
    additionalPhotos;
    socialMediaLinks;
    preferredLanguages;
    accountStatus;
    membershipPackage;
    timeZone;
    highestEducation;
    institutionName;
    profession;
    companyName;
    monthlyIncome;
    incomeCurrency;
    religion;
    politicalView;
    livingArrangement;
    familyMemberCount;
    interestedInGender;
    lookingFor;
    preferredAgeRange;
    preferredNationality;
    religionPreference;
    politicalPreference;
    partnerExpectations;
    weightKg;
    heightCm;
    bodyType;
    drinkingHabit;
    smokingHabit;
    hasPet;
    healthCondition;
    dietaryPreference;
    children;
    familyBackground;
    culturalPractices;
    astrologicalSign;
    loveLanguage;
    favoriteQuote;
    profileVisibility;
    photoVisibility;
    messageAvailability;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 100),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.UserRole),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "userRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Gender),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "motherTongue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.MaritalStatus),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "profilePicture", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "additionalPhotos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SocialMediaLinkDto),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (isSocialMediaLinkArray(parsed)) {
                    return (0, class_transformer_1.plainToInstance)(SocialMediaLinkDto, parsed);
                }
                return [];
            }
            catch {
                return [];
            }
        }
        if (isSocialMediaLinkArray(value)) {
            return (0, class_transformer_1.plainToInstance)(SocialMediaLinkDto, value);
        }
        return [];
    }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "socialMediaLinks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if ((0, helpers_1.isStringArray)(parsed)) {
                    return parsed;
                }
                return [];
            }
            catch {
                return [];
            }
        }
        if ((0, helpers_1.isStringArray)(value)) {
            return value;
        }
        return [];
    }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "preferredLanguages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.AccountStatus),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "accountStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => membership_package_dto_1.MembershipPackageDto),
    __metadata("design:type", membership_package_dto_1.MembershipPackageDto)
], UpdateUserDto.prototype, "membershipPackage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "timeZone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "highestEducation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "institutionName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "profession", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const val = Number(value);
        return isNaN(val) ? null : val;
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "monthlyIncome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Currency),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "incomeCurrency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Religion),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "religion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.PoliticalView),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "politicalView", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.LivingArrangement),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "livingArrangement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "familyMemberCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "interestedInGender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.LookingFor),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lookingFor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "preferredAgeRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if ((0, helpers_1.isStringArray)(parsed)) {
                    return parsed;
                }
                return [];
            }
            catch {
                return [];
            }
        }
        if ((0, helpers_1.isStringArray)(value)) {
            return value;
        }
        return [];
    }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "preferredNationality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.ReligionPreference),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "religionPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "politicalPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "partnerExpectations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const val = Number(value);
        return isNaN(val) ? null : val;
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "weightKg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const val = Number(value);
        return isNaN(val) ? null : val;
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "heightCm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.BodyType),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "bodyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.DrinkingHabit),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "drinkingHabit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.SmokingHabit),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "smokingHabit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "hasPet", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.HealthCondition),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "healthCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.DietaryPreference),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "dietaryPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const val = Number(value);
        return isNaN(val) ? null : val;
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "children", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.FamilyBackground),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "familyBackground", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.CulturalPractices),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "culturalPractices", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.AstrologicalSign),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "astrologicalSign", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.LoveLanguage),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "loveLanguage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "favoriteQuote", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.PrivacySettings),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "profileVisibility", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.PrivacySettings),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "photoVisibility", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.PrivacySettings),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "messageAvailability", void 0);
//# sourceMappingURL=update-user.dto.js.map