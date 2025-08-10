import { IsEnum, IsString } from 'class-validator';
import { PaymentGateway } from '../enum/payment.enum';

export class CreateMembershipPaymentDto {
  @IsString()
  membershipPurchaseId: string;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsString()
  currency: string;
}
