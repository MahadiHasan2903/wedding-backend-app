import { PaymentGateway, PaymentStatus } from '../enum/payment.enum';

export interface PaymentFiltersOptions {
  gateway?: PaymentGateway;
  paymentStatus?: PaymentStatus;
  dateRange?: string;
}
