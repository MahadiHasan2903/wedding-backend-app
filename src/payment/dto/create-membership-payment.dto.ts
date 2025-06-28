import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentGateway } from '../enum/payment.enum';

export class CreateMembershipPaymentDto {
  @IsNumber()
  membershipPurchaseId: number;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsString()
  currency: string;
}
