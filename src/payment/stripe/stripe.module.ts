import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { stripeClientFactory } from './stripe.config';
import { StripeService } from './stripe.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: stripeClientFactory,
      inject: [ConfigService],
    },
    StripeService,
  ],
  exports: ['STRIPE_CLIENT', StripeService],
})
export class StripeModule {}
