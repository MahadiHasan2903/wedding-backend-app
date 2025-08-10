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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const helpers_1 = require("../utils/helpers");
const payment_service_1 = require("./payment.service");
const users_enum_1 = require("../users/enum/users.enum");
const search_payment_dto_1 = require("./dto/search-payment.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_membership_payment_dto_1 = require("./dto/create-membership-payment.dto");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async purchaseMembership(dto) {
        try {
            const result = await this.paymentService.createMembershipPayment(dto);
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                message: 'Membership payment intent created successfully',
                data: result,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to create membership payment',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async stripeCallback(sessionId) {
        const result = await this.paymentService.stripePaymentCallback(sessionId);
        return {
            statusCode: common_1.HttpStatus.PERMANENT_REDIRECT,
            url: result.url,
        };
    }
    async membershipPaypalPaymentCallback(orderId) {
        try {
            const response = await this.paymentService.paypalPaymentCallback(orderId);
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                message: 'PayPal membership payment completed successfully',
                data: response,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'PayPal membership payment failed',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAllPayments(query) {
        try {
            const { page, pageSize, sort, gateway, paymentStatus, dateRange } = query;
            const payments = await this.paymentService.getAllPayments(page, pageSize, sort, {
                gateway,
                paymentStatus,
                dateRange,
            });
            return {
                status: 200,
                success: true,
                message: 'Payments retrieved successfully',
                data: payments,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to retrieve payments',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getUserPaymentHistory(query, user) {
        try {
            const { page, pageSize, sort, gateway, paymentStatus, dateRange } = query;
            const payments = await this.paymentService.getPaymentsByUserId(user.userId, page, pageSize, sort, {
                gateway,
                paymentStatus,
                dateRange,
            });
            return {
                status: 200,
                success: true,
                message: 'User payment history retrieved successfully',
                data: payments,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to retrieve user payment history',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getPaymentDetails(transactionId) {
        try {
            const payment = await this.paymentService.getPaymentByTransactionId(transactionId);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Payment details retrieved successfully',
                data: payment,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to retrieve payment details',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('initiate-payment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_membership_payment_dto_1.CreateMembershipPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "purchaseMembership", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('stripe-payment-callback'),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Query)('session_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "stripeCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('paypal-payment-callback'),
    __param(0, (0, common_1.Query)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "membershipPaypalPaymentCallback", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_payment_dto_1.SearchPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('my-history'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_payment_dto_1.SearchPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getUserPaymentHistory", null);
__decorate([
    (0, common_1.Get)(':transactionId'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentDetails", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('v1/payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map