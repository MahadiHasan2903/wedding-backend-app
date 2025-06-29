import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MsPurchaseModule } from 'src/ms-purchase/ms-purchase.module';
import { PaymentRepository } from './repositories/payment.repository';
import { DataSource } from 'typeorm';
import { StripeModule } from 'src/common/stripe/stripe.module';
import { UsersModule } from 'src/users/users.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [MsPurchaseModule, StripeModule, UsersModule, AccountModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: PaymentRepository,
      useFactory: (dataSource: DataSource) => {
        return new PaymentRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
