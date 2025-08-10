import { PaymentGateway, PaymentStatus } from '../enum/payment.enum';
export declare class Payment {
    id: string;
    user: string;
    transactionId?: string;
    currency: string;
    gateway: PaymentGateway;
    servicePurchaseId: string;
    paymentStatus: PaymentStatus;
    amount: number;
    discount: number;
    payable: number;
    storeAmount: number | null;
    createdAt: Date;
    updatedAt: Date;
}
