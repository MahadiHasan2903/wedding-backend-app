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
exports.MsPurchaseService = void 0;
const common_1 = require("@nestjs/common");
const ms_purchase_repository_1 = require("./repositories/ms-purchase.repository");
const msPackage_service_1 = require("../ms-package/msPackage.service");
const ms_purchase_enum_1 = require("./enum/ms-purchase.enum");
const account_repository_1 = require("../account/repositories/account.repository");
let MsPurchaseService = class MsPurchaseService {
    msPurchaseRepo;
    accountRepo;
    msPackageService;
    constructor(msPurchaseRepo, accountRepo, msPackageService) {
        this.msPurchaseRepo = msPurchaseRepo;
        this.accountRepo = accountRepo;
        this.msPackageService = msPackageService;
    }
    findById(id) {
        return this.msPurchaseRepo.findOne({ where: { id } });
    }
    async findAll({ page, pageSize, sort }) {
        const [sortField, sortOrder] = sort.split(',');
        const [items, totalItems] = await this.msPurchaseRepo.findAndCount({
            order: {
                [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            items,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
    async findByUserId(userId, { page, pageSize, sort }) {
        const [sortField, sortOrder] = sort.split(',');
        const [items, totalItems] = await this.msPurchaseRepo.findAndCount({
            where: { user: userId },
            order: {
                [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            items,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
    async delete(id) {
        const result = await this.msPurchaseRepo.delete(id);
        return !!result?.affected && result.affected > 0;
    }
    async createPurchase(userId, msPackageId, packagePurchasedCategory) {
        const purchasedAt = new Date();
        let expiresAt;
        if (packagePurchasedCategory === ms_purchase_enum_1.PurchasePackageCategory.MONTHLY) {
            expiresAt = new Date(purchasedAt);
            expiresAt.setDate(expiresAt.getDate() + 30);
        }
        else if (packagePurchasedCategory === ms_purchase_enum_1.PurchasePackageCategory.YEARLY) {
            expiresAt = new Date(purchasedAt);
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        else if (packagePurchasedCategory === ms_purchase_enum_1.PurchasePackageCategory.LIFETIME) {
            expiresAt = undefined;
        }
        const msPackage = await this.msPackageService.findOne(Number(msPackageId));
        if (!msPackage) {
            throw new common_1.NotFoundException(`Package with id ${msPackageId} not found`);
        }
        const amount = msPackage.categoryInfo.originalPrice || 0;
        const discount = amount - msPackage.categoryInfo.sellPrice || 0;
        const payable = amount - discount;
        const purchase = this.msPurchaseRepo.create({
            user: userId,
            packageId: msPackageId,
            purchasePackageCategory: packagePurchasedCategory,
            purchasedAt,
            expiresAt,
            amount,
            discount,
            payable,
            status: msPackageId === 1 ? ms_purchase_enum_1.PurchaseStatus.SUCCEEDED : ms_purchase_enum_1.PurchaseStatus.PENDING,
            paymentStatus: msPackageId === 1 ? ms_purchase_enum_1.PaymentStatus.PAID : ms_purchase_enum_1.PaymentStatus.PENDING,
        });
        const savedPurchase = await this.msPurchaseRepo.save(purchase);
        if (msPackageId === 1) {
            await this.accountRepo.update(userId, {
                purchasedMembership: savedPurchase.id,
            });
        }
        const { packageId, purchasePackageCategory, ...purchaseWithoutPackage } = savedPurchase;
        return {
            ...purchaseWithoutPackage,
            membershipPackageInfo: {
                id: msPackage.id,
                title: msPackage.title,
                description: msPackage.description,
                categoryInfo: msPackage.categoryInfo || null,
            },
        };
    }
};
exports.MsPurchaseService = MsPurchaseService;
exports.MsPurchaseService = MsPurchaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ms_purchase_repository_1.MsPurchaseRepository,
        account_repository_1.AccountRepository,
        msPackage_service_1.MsPackageService])
], MsPurchaseService);
//# sourceMappingURL=ms-purchase.service.js.map