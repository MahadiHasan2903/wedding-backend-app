import { PaymentStatus, PurchasePackageCategory, PurchaseStatus } from '../enum/ms-purchase.enum';
export declare class MsPurchase {
    id: string;
    user: string;
    packageId: number;
    purchasePackageCategory: PurchasePackageCategory;
    amount: number;
    discount: number;
    payable: number;
    status: PurchaseStatus;
    paymentStatus: PaymentStatus;
    purchasedAt: Date;
    expiresAt?: Date;
}
