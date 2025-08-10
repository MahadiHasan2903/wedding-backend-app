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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchPaymentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const payment_enum_1 = require("../enum/payment.enum");
class SearchPaymentDto {
    page = 1;
    pageSize = 10;
    sort = 'id,DESC';
    gateway;
    paymentStatus;
    dateRange;
}
exports.SearchPaymentDto = SearchPaymentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchPaymentDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchPaymentDto.prototype, "pageSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_]+,(ASC|DESC)$/i, {
        message: 'sort must be in the format "field,ASC" or "field,DESC"',
    }),
    __metadata("design:type", String)
], SearchPaymentDto.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_enum_1.PaymentGateway),
    __metadata("design:type", String)
], SearchPaymentDto.prototype, "gateway", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(payment_enum_1.PaymentStatus),
    __metadata("design:type", String)
], SearchPaymentDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/, {
        message: 'joined must be in format "YYYY-MM-DD - YYYY-MM-DD"',
    }),
    __metadata("design:type", String)
], SearchPaymentDto.prototype, "dateRange", void 0);
//# sourceMappingURL=search-payment.dto.js.map