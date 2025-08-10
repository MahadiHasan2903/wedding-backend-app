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
exports.PaymentService = void 0;
const config_1 = require("@nestjs/config");
const payment_enum_1 = require("./enum/payment.enum");
const payment_repository_1 = require("./repositories/payment.repository");
const common_1 = require("@nestjs/common");
const ms_purchase_repository_1 = require("../ms-purchase/repositories/ms-purchase.repository");
const ms_purchase_enum_1 = require("../ms-purchase/enum/ms-purchase.enum");
const user_repository_1 = require("../users/repositories/user.repository");
const account_repository_1 = require("../account/repositories/account.repository");
const stripe_service_1 = require("./stripe/stripe.service");
const paypal_service_1 = require("./paypal/paypal.service");
let PaymentService = class PaymentService {
    msPurchaseRepo;
    paymentRepo;
    userRepo;
    accountRepo;
    stripeService;
    paypalService;
    configService;
    constructor(msPurchaseRepo, paymentRepo, userRepo, accountRepo, stripeService, paypalService, configService) {
        this.msPurchaseRepo = msPurchaseRepo;
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
        this.accountRepo = accountRepo;
        this.stripeService = stripeService;
        this.paypalService = paypalService;
        this.configService = configService;
    }
    async createMembershipPayment(dto) {
        const { membershipPurchaseId, gateway, currency } = dto;
        if (gateway === payment_enum_1.PaymentGateway.STRIPE) {
            const membershipPurchase = await this.msPurchaseRepo.findOne({
                where: { id: membershipPurchaseId },
            });
            if (!membershipPurchase) {
                throw new common_1.BadRequestException('Membership purchase not found');
            }
            const returnUrl = this.configService.get('BASE_URL') +
                '/v1/payment/stripe-payment-callback';
            const session = await this.stripeService.createCheckoutSession({
                membershipPurchase,
                returnUrl,
                currency,
            });
            const payment = this.paymentRepo.create({
                user: membershipPurchase.user,
                currency,
                gateway,
                servicePurchaseId: membershipPurchase.id,
                paymentStatus: payment_enum_1.PaymentStatus.PENDING,
                amount: membershipPurchase.amount,
                discount: membershipPurchase.discount,
                payable: membershipPurchase.payable,
                transactionId: session.id,
                storeAmount: null,
            });
            await this.paymentRepo.save(payment);
            return {
                clientSecret: session.client_secret,
                transactionId: session.id,
                paymentStatus: 'pending',
            };
        }
        if (gateway === payment_enum_1.PaymentGateway.PAYPAL) {
            const membershipPurchase = await this.msPurchaseRepo.findOne({
                where: { id: membershipPurchaseId },
            });
            if (!membershipPurchase) {
                throw new common_1.BadRequestException('Membership purchase not found');
            }
            const returnUrl = this.configService.get('BASE_URL') +
                '/v1/payment/paypal-payment-callback';
            const cancelUrl = this.configService.get('BASE_URL') + '/payment/cancel';
            const payableAmount = Number(membershipPurchase.payable);
            const order = await this.paypalService.createOrder(payableAmount, currency, returnUrl, cancelUrl);
            const approvalUrl = order.links.find((link) => link.rel === 'approve')?.href;
            const payment = this.paymentRepo.create({
                user: membershipPurchase.user,
                currency,
                gateway,
                servicePurchaseId: membershipPurchase.id,
                paymentStatus: payment_enum_1.PaymentStatus.PENDING,
                amount: membershipPurchase.amount,
                discount: membershipPurchase.discount,
                payable: membershipPurchase.payable,
                transactionId: order.id,
                storeAmount: null,
            });
            await this.paymentRepo.save(payment);
            return {
                approvalUrl,
                transactionId: order.id,
                paymentStatus: 'pending',
            };
        }
    }
    async stripePaymentCallback(sessionId) {
        const session = await this.stripeService.retrieveSession(sessionId);
        if (!session) {
            throw new common_1.BadRequestException('Invalid session ID');
        }
        const paymentIntent = await this.stripeService.retrievePaymentIntent(session.payment_intent);
        const updatedStatus = paymentIntent.status === 'succeeded'
            ? payment_enum_1.PaymentStatus.PAID
            : payment_enum_1.PaymentStatus.FAILED;
        const updatedPayment = await this.paymentRepo.findOneByTransactionId(sessionId);
        if (!updatedPayment) {
            throw new common_1.NotFoundException('Payment record not found');
        }
        updatedPayment.paymentStatus = updatedStatus;
        await this.paymentRepo.save(updatedPayment);
        const purchase = await this.msPurchaseRepo.findOne({
            where: { id: updatedPayment.servicePurchaseId },
        });
        if (purchase) {
            purchase.paymentStatus = updatedStatus;
            purchase.status =
                updatedStatus === payment_enum_1.PaymentStatus.PAID
                    ? ms_purchase_enum_1.PurchaseStatus.SUCCEEDED
                    : ms_purchase_enum_1.PurchaseStatus.FAILED;
            await this.msPurchaseRepo.save(purchase);
            const fetchedUser = await this.userRepo.findByIdWithoutPassword(purchase.user);
            if (fetchedUser) {
                fetchedUser.purchasedMembership = purchase.id;
                await this.accountRepo.save(fetchedUser);
            }
        }
        return {
            url: this.configService.get('CLIENT_BASE_URL') +
                `/pricing/payment-success?transactionId=${sessionId}&status=${paymentIntent.status}`,
        };
    }
    async paypalPaymentCallback(orderId) {
        const order = await this.paypalService.captureOrder(orderId);
        const status = order.status === 'COMPLETED' ? payment_enum_1.PaymentStatus.PAID : payment_enum_1.PaymentStatus.FAILED;
        const payment = await this.paymentRepo.findOneByTransactionId(orderId);
        if (!payment) {
            throw new common_1.NotFoundException('Payment record not found');
        }
        payment.paymentStatus = status;
        await this.paymentRepo.save(payment);
        const purchase = await this.msPurchaseRepo.findOne({
            where: { id: payment.servicePurchaseId },
        });
        if (purchase) {
            purchase.paymentStatus = status;
            purchase.status =
                status === payment_enum_1.PaymentStatus.PAID
                    ? ms_purchase_enum_1.PurchaseStatus.SUCCEEDED
                    : ms_purchase_enum_1.PurchaseStatus.FAILED;
            await this.msPurchaseRepo.save(purchase);
            const fetchedUser = await this.userRepo.findByIdWithoutPassword(purchase.user);
            if (fetchedUser) {
                fetchedUser.purchasedMembership = purchase.id;
                await this.accountRepo.save(fetchedUser);
            }
        }
        return {
            url: this.configService.get('CLIENT_BASE_URL') +
                `/pricing/payment-success?transactionId=${orderId}&status=${status.toLowerCase()}`,
        };
    }
    async getPaymentByTransactionId(transactionId) {
        const payment = await this.paymentRepo.findOneByTransactionId(transactionId);
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with transactionId ${transactionId} not found`);
        }
        const membershipPurchase = await this.msPurchaseRepo.findOne({
            where: { id: payment.servicePurchaseId },
        });
        const user = await this.userRepo.findByIdWithoutPassword(payment.user);
        return {
            ...payment,
            userId: user,
            servicePurchaseId: membershipPurchase,
        };
    }
    async getAllPayments(page = 1, pageSize = 10, sort = 'id,DESC', filters = {}) {
        const { items, totalItems, itemsPerPage, currentPage, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, } = await this.paymentRepo.findFilteredAndPaginated(page, pageSize, sort, filters);
        const itemsWithMembership = await Promise.all(items.map(async (payment) => {
            const membershipPurchase = await this.msPurchaseRepo.findOne({
                where: { id: payment.servicePurchaseId },
            });
            const user = await this.userRepo.findByIdWithoutPassword(payment.user);
            return {
                ...payment,
                user,
                servicePurchaseId: membershipPurchase,
            };
        }));
        return {
            items: itemsWithMembership,
            totalItems,
            itemsPerPage,
            currentPage,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
    async getPaymentsByUserId(user, page = 1, pageSize = 10, sort = 'id,DESC', filters = {}) {
        const { items, totalItems, itemsPerPage, currentPage, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, } = await this.paymentRepo.findFilteredAndPaginated(page, pageSize, sort, filters, user);
        const itemsWithMembership = await Promise.all(items.map(async (payment) => {
            const membershipPurchase = await this.msPurchaseRepo.findOne({
                where: { id: payment.servicePurchaseId },
            });
            const user = await this.userRepo.findByIdWithoutPassword(payment.user);
            return {
                ...payment,
                user,
                servicePurchaseId: membershipPurchase,
            };
        }));
        return {
            items: itemsWithMembership,
            totalItems,
            itemsPerPage,
            currentPage,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ms_purchase_repository_1.MsPurchaseRepository,
        payment_repository_1.PaymentRepository,
        user_repository_1.UserRepository,
        account_repository_1.AccountRepository,
        stripe_service_1.StripeService,
        paypal_service_1.PayPalService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map