import { MsPurchase } from 'src/ms-purchase/entities/ms-purchase.entity';
import Stripe from 'stripe';
export declare class StripeService {
    private readonly stripe;
    constructor(stripe: Stripe);
    createCheckoutSession({ membershipPurchase, returnUrl, currency, }: {
        membershipPurchase: MsPurchase;
        returnUrl: string;
        currency: string;
    }): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    retrieveSession(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    retrievePaymentIntent(intentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
}
