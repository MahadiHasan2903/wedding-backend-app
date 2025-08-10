"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeClientFactory = void 0;
const stripe_1 = require("stripe");
const stripeClientFactory = (configService) => {
    const secretKey = configService.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    return new stripe_1.default(secretKey, {
        apiVersion: '2025-05-28.basil',
    });
};
exports.stripeClientFactory = stripeClientFactory;
//# sourceMappingURL=stripe.config.js.map