import { MsPurchase } from './entities/ms-purchase.entity';
import { MsPurchaseRepository } from './repositories/ms-purchase.repository';
import { MsPackageService } from 'src/ms-package/msPackage.service';
import { PaymentStatus, PurchasePackageCategory, PurchaseStatus } from './enum/ms-purchase.enum';
import { PaginationOptions } from 'src/types/common.types';
import { AccountRepository } from 'src/account/repositories/account.repository';
export declare class MsPurchaseService {
    private readonly msPurchaseRepo;
    private readonly accountRepo;
    private readonly msPackageService;
    constructor(msPurchaseRepo: MsPurchaseRepository, accountRepo: AccountRepository, msPackageService: MsPackageService);
    findById(id: string): Promise<MsPurchase | null>;
    findAll({ page, pageSize, sort }: PaginationOptions): Promise<{
        items: MsPurchase[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    findByUserId(userId: string, { page, pageSize, sort }: PaginationOptions): Promise<{
        items: MsPurchase[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    delete(id: string): Promise<boolean>;
    createPurchase(userId: string, msPackageId: number, packagePurchasedCategory: PurchasePackageCategory): Promise<{
        membershipPackageInfo: {
            id: number;
            title: string;
            description: string[];
            categoryInfo: import("../ms-package/entities/msPackage.entity").CategoryInfo;
        };
        id: string;
        user: string;
        amount: number;
        discount: number;
        payable: number;
        status: PurchaseStatus;
        paymentStatus: PaymentStatus;
        purchasedAt: Date;
        expiresAt?: Date;
    }>;
}
