import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
export declare const stripeClientFactory: (configService: ConfigService) => Stripe;
