/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

export const stripeClientFactory = (configService: ConfigService): Stripe => {
  const secretKey = configService.get<string>('STRIPE_SECRET_KEY');
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }

  return new Stripe(secretKey, {
    apiVersion: '2025-05-28.basil',
  });
};
