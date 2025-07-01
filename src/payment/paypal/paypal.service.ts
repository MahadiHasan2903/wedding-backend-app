import { Inject, Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import {
  PayPalOrderResponse,
  PayPalCaptureOrderResponse,
} from './types/paypal.types';

@Injectable()
export class PayPalService {
  /**
   * Injects the PayPal HTTP client configured with your credentials and environment.
   * @param client The PayPal HTTP client instance
   */
  constructor(
    @Inject('PAYPAL_CLIENT')
    private readonly client: paypal.core.PayPalHttpClient,
  ) {}

  /**
   * Creates a PayPal order with the specified amount and redirect URLs.
   *
   * @param amount - The total amount to be charged.
   * @param currency - The currency code (e.g., "USD").
   * @param returnUrl - The URL PayPal redirects to after successful approval.
   * @param cancelUrl - The URL PayPal redirects to if the user cancels the payment.
   * @returns A promise that resolves to the created PayPal order.
   */
  async createOrder(
    amount: number,
    currency: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<PayPalOrderResponse> {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    });

    const response = await this.client.execute(request);
    return response.result as PayPalOrderResponse;
  }

  /**
   * Captures a previously approved PayPal order by order ID.
   *
   * @param orderId - The ID of the PayPal order to capture.
   * @returns A promise that resolves to the capture result of the PayPal order.
   */
  async captureOrder(orderId: string): Promise<PayPalCaptureOrderResponse> {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({} as any); // Required by PayPal SDK (even if body is empty)
    const response = await this.client.execute(request);
    return response.result as PayPalCaptureOrderResponse;
  }
}
