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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const users_enum_1 = require("../enum/users.enum");
let User = class User {
    id;
    firstName;
    lastName;
    email;
    phoneNumber;
    password;
    bio;
    motherTongue;
    dateOfBirth;
    gender;
    nationality;
    country;
    city;
    maritalStatus;
    profilePicture;
    additionalPhotos;
    blockedUsers;
    likedUsers;
    socialMediaLinks;
    preferredLanguages;
    userRole;
    accountStatus;
    purchasedMembership;
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
    healthCondition;
    hasPet;
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
    createdAt;
    updatedAt;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "motherTongue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.Gender, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.MaritalStatus, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "additionalPhotos", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "blockedUsers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "likedUsers", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "socialMediaLinks", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "preferredLanguages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.UserRole, default: users_enum_1.UserRole.USER }),
    __metadata("design:type", String)
], User.prototype, "userRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.AccountStatus, default: users_enum_1.AccountStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "accountStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "purchasedMembership", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "timeZone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "highestEducation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "institutionName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "monthlyIncome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.Currency, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "incomeCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.Religion, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "religion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.PoliticalView, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "politicalView", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.LivingArrangement, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "livingArrangement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "familyMemberCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "interestedInGender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.LookingFor, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lookingFor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "preferredAgeRange", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "preferredNationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.ReligionPreference, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "religionPreference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "politicalPreference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "partnerExpectations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "weightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "heightCm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.BodyType, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "bodyType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.DrinkingHabit, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "drinkingHabit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.SmokingHabit, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "smokingHabit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.HealthCondition, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "healthCondition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "hasPet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.DietaryPreference, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "dietaryPreference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.FamilyBackground, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "familyBackground", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.CulturalPractices, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "culturalPractices", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.AstrologicalSign, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "astrologicalSign", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: users_enum_1.LoveLanguage, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "loveLanguage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "favoriteQuote", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: users_enum_1.PrivacySettings,
        default: users_enum_1.PrivacySettings.EVERYONE,
    }),
    __metadata("design:type", String)
], User.prototype, "profileVisibility", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: users_enum_1.PrivacySettings,
        default: users_enum_1.PrivacySettings.EVERYONE,
    }),
    __metadata("design:type", String)
], User.prototype, "photoVisibility", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: users_enum_1.PrivacySettings,
        default: users_enum_1.PrivacySettings.EVERYONE,
    }),
    __metadata("design:type", String)
], User.prototype, "messageAvailability", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map