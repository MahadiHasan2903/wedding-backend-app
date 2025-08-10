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
exports.MsPackage = exports.CategoryInfo = void 0;
const typeorm_1 = require("typeorm");
const msPackage_enum_1 = require("../enum/msPackage.enum");
class CategoryInfo {
    category;
    originalPrice;
    sellPrice;
}
exports.CategoryInfo = CategoryInfo;
let MsPackage = class MsPackage {
    id;
    title;
    description;
    status;
    categoryInfo;
};
exports.MsPackage = MsPackage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MsPackage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], MsPackage.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", Array)
], MsPackage.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: msPackage_enum_1.PackageStatus,
        default: msPackage_enum_1.PackageStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], MsPackage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('json'),
    __metadata("design:type", CategoryInfo)
], MsPackage.prototype, "categoryInfo", void 0);
exports.MsPackage = MsPackage = __decorate([
    (0, typeorm_1.Entity)('membership_packages')
], MsPackage);
//# sourceMappingURL=msPackage.entity.js.map