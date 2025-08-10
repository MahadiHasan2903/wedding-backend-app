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
exports.CreateAccountDto = exports.SocialMediaLinkDto = void 0;
const class_validator_1 = require("class-validator");
const users_enum_1 = require("../../users/enum/users.enum");
const class_transformer_1 = require("class-transformer");
const membership_package_dto_1 = require("../../users/dto/membership-package.dto");
class SocialMediaLinkDto {
    name;
    link;
}
exports.SocialMediaLinkDto = SocialMediaLinkDto;
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
class CreateAccountDto {
    firstName;
    lastName;
    email;
    phoneNumber;
    password;
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
    userRole;
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
}
exports.CreateAccountDto = CreateAccountDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 100),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Gender),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "motherTongue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.MaritalStatus),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "profilePicture", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateAccountDto.prototype, "additionalPhotos", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SocialMediaLinkDto),
    __metadata("design:type", Array)
], CreateAccountDto.prototype, "socialMediaLinks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAccountDto.prototype, "preferredLanguages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.UserRole),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "userRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.AccountStatus),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "accountStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => membership_package_dto_1.MembershipPackageDto),
    __metadata("design:type", membership_package_dto_1.MembershipPackageDto)
], CreateAccountDto.prototype, "membershipPackage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "timeZone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "highestEducation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "institutionName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "profession", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAccountDto.prototype, "monthlyIncome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Currency),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "incomeCurrency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Religion),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "religion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.PoliticalView),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "politicalView", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.LivingArrangement),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "livingArrangement", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAccountDto.prototype, "familyMemberCount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "interestedInGender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.LookingFor),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "lookingFor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "preferredAgeRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateAccountDto.prototype, "preferredNationality", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.ReligionPreference),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "religionPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "politicalPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "partnerExpectations", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    (0, class_validator_1.Max)(300),
    __metadata("design:type", Number)
], CreateAccountDto.prototype, "weightKg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(250),
    __metadata("design:type", Number)
], CreateAccountDto.prototype, "heightCm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.BodyType),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "bodyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.DrinkingHabit),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "drinkingHabit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.SmokingHabit),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "smokingHabit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAccountDto.prototype, "hasPet", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.HealthCondition),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "healthCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.DietaryPreference),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "dietaryPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAccountDto.prototype, "children", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.FamilyBackground),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "familyBackground", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.CulturalPractices),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "culturalPractices", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.AstrologicalSign),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "astrologicalSign", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.LoveLanguage),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "loveLanguage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccountDto.prototype, "favoriteQuote", void 0);
//# sourceMappingURL=create-account.dto.js.map