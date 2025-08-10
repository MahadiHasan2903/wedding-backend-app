"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
let StripeService = class StripeService {
    stripe;
    constructor(stripe) {
        this.stripe = stripe;
    }
    async createCheckoutSession({ membershipPurchase, returnUrl, currency, }) {
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
    async retrieveSession(sessionId) {
        return await this.stripe.checkout.sessions.retrieve(sessionId);
    }
    async retrievePaymentIntent(intentId) {
        return await this.stripe.paymentIntents.retrieve(intentId);
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [stripe_1.default])
], StripeService);
//# sourceMappingURL=stripe.service.js.map