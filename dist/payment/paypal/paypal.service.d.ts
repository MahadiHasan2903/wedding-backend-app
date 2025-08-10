import * as paypal from '@paypal/checkout-server-sdk';
import { PayPalOrderResponse, PayPalCaptureOrderResponse } from './types/paypal.types';
export declare class PayPalService {
    private readonly client;
    constructor(client: paypal.core.PayPalHttpClient);
    createOrder(amount: number, currency: string, returnUrl: string, cancelUrl: string): Promise<PayPalOrderResponse>;
    captureOrder(orderId: string): Promise<PayPalCaptureOrderResponse>;
}
