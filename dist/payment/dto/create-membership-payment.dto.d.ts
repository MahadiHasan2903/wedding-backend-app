import { PaymentGateway } from '../enum/payment.enum';
export declare class CreateMembershipPaymentDto {
    membershipPurchaseId: string;
    gateway: PaymentGateway;
    currency: string;
}
