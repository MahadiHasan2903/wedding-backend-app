import { PaymentGateway, PaymentStatus } from '../enum/payment.enum';

export interface PaymentFiltersOptions {
  gateway?: PaymentGateway;
  paymentStatus?: PaymentStatus;
  dateRange?: string;
}

export interface SumResult {
  sum: string | null;
}

export interface PerMonthRaw {
  month: string;
  year: string;
  totalAmount: string;
}
