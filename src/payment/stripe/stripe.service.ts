import { Inject, Injectable } from '@nestjs/common';
import { MsPurchase } from 'src/ms-purchase/entities/ms-purchase.entity';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async createCheckoutSession({
    membershipPurchase,
    returnUrl,
    currency,
  }: {
    membershipPurchase: MsPurchase;
    returnUrl: string;
    currency: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      ui_mode: 'custom',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Membership Package #${membershipPurchase.packageId}`,
            },
            unit_amount: Math.round(membershipPurchase.payable * 100),
          },
          quantity: 1,
        },
      ],
      return_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        membershipPurchaseId: membershipPurchase.id.toString(),
        userId: membershipPurchase.user.toString(),
      },
    });

    return session;
  }

  async retrieveSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async retrievePaymentIntent(intentId: string) {
    return await this.stripe.paymentIntents.retrieve(intentId);
  }
}
