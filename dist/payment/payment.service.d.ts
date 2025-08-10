import { ConfigService } from '@nestjs/config';
import { PaymentGateway, PaymentStatus } from './enum/payment.enum';
import { PaymentRepository } from './repositories/payment.repository';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';
import { MsPurchaseRepository } from 'src/ms-purchase/repositories/ms-purchase.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AccountRepository } from 'src/account/repositories/account.repository';
import { StripeService } from './stripe/stripe.service';
import { PayPalService } from './paypal/paypal.service';
import { PaymentFiltersOptions } from './types/payment.types';
export declare class PaymentService {
    private readonly msPurchaseRepo;
    private readonly paymentRepo;
    private readonly userRepo;
    private readonly accountRepo;
    private readonly stripeService;
    private readonly paypalService;
    private configService;
    constructor(msPurchaseRepo: MsPurchaseRepository, paymentRepo: PaymentRepository, userRepo: UserRepository, accountRepo: AccountRepository, stripeService: StripeService, paypalService: PayPalService, configService: ConfigService);
    createMembershipPayment(dto: CreateMembershipPaymentDto): Promise<{
        clientSecret: string | null;
        transactionId: string;
        paymentStatus: string;
        approvalUrl?: undefined;
    } | {
        approvalUrl: string | undefined;
        transactionId: string;
        paymentStatus: string;
        clientSecret?: undefined;
    } | undefined>;
    stripePaymentCallback(sessionId: string): Promise<{
        url: string;
    }>;
    paypalPaymentCallback(orderId: string): Promise<{
        url: string;
    }>;
    getPaymentByTransactionId(transactionId: string): Promise<{
        userId: Omit<import("../users/entities/user.entity").User, "password"> | null;
        servicePurchaseId: import("../ms-purchase/entities/ms-purchase.entity").MsPurchase | null;
        id: string;
        user: string;
        transactionId?: string;
        currency: string;
        gateway: PaymentGateway;
        paymentStatus: PaymentStatus;
        amount: number;
        discount: number;
        payable: number;
        storeAmount: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllPayments(page?: number, pageSize?: number, sort?: string, filters?: PaymentFiltersOptions): Promise<{
        items: {
            user: Omit<import("../users/entities/user.entity").User, "password"> | null;
            servicePurchaseId: import("../ms-purchase/entities/ms-purchase.entity").MsPurchase | null;
            id: string;
            transactionId?: string;
            currency: string;
            gateway: PaymentGateway;
            paymentStatus: PaymentStatus;
            amount: number;
            discount: number;
            payable: number;
            storeAmount: number | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
    getPaymentsByUserId(user: string, page?: number, pageSize?: number, sort?: string, filters?: PaymentFiltersOptions): Promise<{
        items: {
            user: Omit<import("../users/entities/user.entity").User, "password"> | null;
            servicePurchaseId: import("../ms-purchase/entities/ms-purchase.entity").MsPurchase | null;
            id: string;
            transactionId?: string;
            currency: string;
            gateway: PaymentGateway;
            paymentStatus: PaymentStatus;
            amount: number;
            discount: number;
            payable: number;
            storeAmount: number | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
}
