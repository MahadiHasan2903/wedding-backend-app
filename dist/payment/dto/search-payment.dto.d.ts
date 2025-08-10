import { PaymentGateway, PaymentStatus } from '../enum/payment.enum';
export declare class SearchPaymentDto {
    page?: number;
    pageSize?: number;
    sort?: string;
    gateway?: PaymentGateway;
    paymentStatus?: PaymentStatus;
    dateRange?: string;
}
