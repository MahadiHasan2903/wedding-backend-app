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
exports.PayPalService = void 0;
const common_1 = require("@nestjs/common");
const paypal = require("@paypal/checkout-server-sdk");
let PayPalService = class PayPalService {
    client;
    constructor(client) {
        this.client = client;
    }
    async createOrder(amount, currency, returnUrl, cancelUrl) {
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
        return response.result;
    }
    async captureOrder(orderId) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await this.client.execute(request);
        return response.result;
    }
};
exports.PayPalService = PayPalService;
exports.PayPalService = PayPalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PAYPAL_CLIENT')),
    __metadata("design:paramtypes", [paypal.core.PayPalHttpClient])
], PayPalService);
//# sourceMappingURL=paypal.service.js.map