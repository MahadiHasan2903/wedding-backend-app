"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypalClientFactory = void 0;
const paypal = require("@paypal/checkout-server-sdk");
const paypalClientFactory = (configService) => {
    const clientId = configService.get('PAYPAL_CLIENT_ID');
    const clientSecret = configService.get('PAYPAL_CLIENT_SECRET');
    const env = configService.get('PAYPAL_ENV') || 'sandbox';
    if (!clientId || !clientSecret) {
        throw new Error('PayPal client credentials are not set');
    }
    const environment = env === 'live'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    return new paypal.core.PayPalHttpClient(environment);
};
exports.paypalClientFactory = paypalClientFactory;
//# sourceMappingURL=paypal.config.js.map