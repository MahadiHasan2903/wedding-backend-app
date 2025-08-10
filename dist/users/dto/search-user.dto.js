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
exports.SearchUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const users_enum_1 = require("../enum/users.enum");
class SearchUserDto {
    page = 1;
    pageSize = 10;
    sort = 'id,DESC';
    name;
    age;
    height;
    weight;
    monthlyIncome;
    joined;
    lookingFor;
    religion;
    politicalView;
    maritalStatus;
    hasChildren;
    hasPet;
    country;
    accountType;
    city;
    languageSpoken;
    education;
    profession;
    familyMember;
    dietaryPreference;
    drinkingHabit;
    smokingHabit;
    healthCondition;
}
exports.SearchUserDto = SearchUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "pageSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_]+,(ASC|DESC)$/i, {
        message: 'sort must be in the format "field,ASC" or "field,DESC"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{1,3}-\d{1,3}$/, {
        message: 'age must be in format "min-max"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{1,3}-\d{1,3}$/, {
        message: 'height must be in format "min-max"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{1,3}-\d{1,3}$/, {
        message: 'weight must be in format "min-max"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d+-\d+$/, {
        message: 'monthly income must be in format "min-max"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "monthlyIncome", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/, {
        message: 'joined must be in format "YYYY-MM-DD - YYYY-MM-DD"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "joined", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Gender),
    __metadata("design:type", String)
], SearchUserDto.prototype, "lookingFor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.Religion),
    __metadata("design:type", String)
], SearchUserDto.prototype, "religion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.PoliticalView),
    __metadata("design:type", String)
], SearchUserDto.prototype, "politicalView", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.MaritalStatus),
    __metadata("design:type", String)
], SearchUserDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchUserDto.prototype, "hasChildren", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchUserDto.prototype, "hasPet", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "accountType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "languageSpoken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "education", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "profession", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d+-\d+$/, {
        message: 'family member must be in format "min-max"',
    }),
    __metadata("design:type", String)
], SearchUserDto.prototype, "familyMember", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.DietaryPreference),
    __metadata("design:type", String)
], SearchUserDto.prototype, "dietaryPreference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.DrinkingHabit),
    __metadata("design:type", String)
], SearchUserDto.prototype, "drinkingHabit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.SmokingHabit),
    __metadata("design:type", String)
], SearchUserDto.prototype, "smokingHabit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(users_enum_1.HealthCondition),
    __metadata("design:type", String)
], SearchUserDto.prototype, "healthCondition", void 0);
//# sourceMappingURL=search-user.dto.js.map