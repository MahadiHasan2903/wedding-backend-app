"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const ms_purchase_module_1 = require("../ms-purchase/ms-purchase.module");
const payment_repository_1 = require("./repositories/payment.repository");
const stripe_module_1 = require("./stripe/stripe.module");
const users_module_1 = require("../users/users.module");
const account_module_1 = require("../account/account.module");
const paypal_module_1 = require("./paypal/paypal.module");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ms_purchase_module_1.MsPurchaseModule,
            stripe_module_1.StripeModule,
            paypal_module_1.PayPalModule,
            users_module_1.UsersModule,
            account_module_1.AccountModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, payment_repository_1.PaymentRepository],
        exports: [payment_service_1.PaymentService, payment_repository_1.PaymentRepository],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map