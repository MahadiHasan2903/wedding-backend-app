import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';
export declare const paypalClientFactory: (configService: ConfigService) => paypal.core.PayPalHttpClient;
