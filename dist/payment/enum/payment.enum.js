"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentGateway = void 0;
var PaymentGateway;
(function (PaymentGateway) {
    PaymentGateway["STRIPE"] = "stripe";
    PaymentGateway["PAYPAL"] = "paypal";
})(PaymentGateway || (exports.PaymentGateway = PaymentGateway = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=payment.enum.js.map