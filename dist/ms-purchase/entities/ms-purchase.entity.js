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
exports.MsPurchase = void 0;
const typeorm_1 = require("typeorm");
const ms_purchase_enum_1 = require("../enum/ms-purchase.enum");
let MsPurchase = class MsPurchase {
    id;
    user;
    packageId;
    purchasePackageCategory;
    amount;
    discount;
    payable;
    status;
    paymentStatus;
    purchasedAt;
    expiresAt;
};
exports.MsPurchase = MsPurchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MsPurchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MsPurchase.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MsPurchase.prototype, "packageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ms_purchase_enum_1.PurchasePackageCategory }),
    __metadata("design:type", String)
], MsPurchase.prototype, "purchasePackageCategory", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MsPurchase.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MsPurchase.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MsPurchase.prototype, "payable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ms_purchase_enum_1.PurchaseStatus,
        default: ms_purchase_enum_1.PurchaseStatus.PENDING,
    }),
    __metadata("design:type", String)
], MsPurchase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ms_purchase_enum_1.PaymentStatus,
        default: ms_purchase_enum_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], MsPurchase.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], MsPurchase.prototype, "purchasedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], MsPurchase.prototype, "expiresAt", void 0);
exports.MsPurchase = MsPurchase = __decorate([
    (0, typeorm_1.Entity)('membership_purchases')
], MsPurchase);
//# sourceMappingURL=ms-purchase.entity.js.map