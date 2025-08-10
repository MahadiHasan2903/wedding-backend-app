import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { paypalClientFactory } from './paypal.config';
import { PayPalService } from './paypal.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PAYPAL_CLIENT',
      useFactory: paypalClientFactory,
      inject: [ConfigService],
    },
    PayPalService,
  ],
  exports: ['PAYPAL_CLIENT', PayPalService],
})
export class PayPalModule {}
