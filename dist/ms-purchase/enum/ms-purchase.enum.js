"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PurchaseStatus = exports.PurchasePackageCategory = void 0;
var PurchasePackageCategory;
(function (PurchasePackageCategory) {
    PurchasePackageCategory["MONTHLY"] = "monthly";
    PurchasePackageCategory["YEARLY"] = "yearly";
    PurchasePackageCategory["LIFETIME"] = "life_time";
})(PurchasePackageCategory || (exports.PurchasePackageCategory = PurchasePackageCategory = {}));
var PurchaseStatus;
(function (PurchaseStatus) {
    PurchaseStatus["PENDING"] = "pending";
    PurchaseStatus["SUCCEEDED"] = "succeeded";
    PurchaseStatus["FAILED"] = "failed";
})(PurchaseStatus || (exports.PurchaseStatus = PurchaseStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
//# sourceMappingURL=ms-purchase.enum.js.map