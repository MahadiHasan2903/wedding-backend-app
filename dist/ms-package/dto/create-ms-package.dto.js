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
exports.CreateMsPackageDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const msPackage_enum_1 = require("../enum/msPackage.enum");
class CategoryInfoDto {
    category;
    originalPrice;
    sellPrice;
}
__decorate([
    (0, class_validator_1.IsEnum)(msPackage_enum_1.CategoryInfoType),
    __metadata("design:type", String)
], CategoryInfoDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CategoryInfoDto.prototype, "originalPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CategoryInfoDto.prototype, "sellPrice", void 0);
class CreateMsPackageDto {
    title;
    description;
    status;
    categoryInfo;
}
exports.CreateMsPackageDto = CreateMsPackageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMsPackageDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateMsPackageDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(msPackage_enum_1.PackageStatus),
    __metadata("design:type", String)
], CreateMsPackageDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CategoryInfoDto),
    __metadata("design:type", CategoryInfoDto)
], CreateMsPackageDto.prototype, "categoryInfo", void 0);
//# sourceMappingURL=create-ms-package.dto.js.map