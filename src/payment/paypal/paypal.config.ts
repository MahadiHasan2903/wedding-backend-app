import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';

export const paypalClientFactory = (configService: ConfigService) => {
  const clientId = configService.get<string>('PAYPAL_CLIENT_ID');
  const clientSecret = configService.get<string>('PAYPAL_CLIENT_SECRET');
  const env = configService.get<string>('PAYPAL_ENV') || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal client credentials are not set');
  }

  const environment: paypal.core.PayPalEnvironment =
    env === 'live'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
};
