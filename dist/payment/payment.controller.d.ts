import { HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { CreateMembershipPaymentDto } from './dto/create-membership-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    purchaseMembership(dto: CreateMembershipPaymentDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            clientSecret: string | null;
            transactionId: string;
            paymentStatus: string;
            approvalUrl?: undefined;
        } | {
            approvalUrl: string | undefined;
            transactionId: string;
            paymentStatus: string;
            clientSecret?: undefined;
        } | undefined;
    }>;
    stripeCallback(sessionId: string): Promise<{
        statusCode: HttpStatus;
        url: string;
    }>;
    membershipPaypalPaymentCallback(orderId: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            url: string;
        };
    }>;
    getAllPayments(query: SearchPaymentDto): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: {
            items: {
                user: Omit<import("../users/entities/user.entity").User, "password"> | null;
                servicePurchaseId: import("../ms-purchase/entities/ms-purchase.entity").MsPurchase | null;
                id: string;
                transactionId?: string;
                currency: string;
                gateway: import("./enum/payment.enum").PaymentGateway;
                paymentStatus: import("./enum/payment.enum").PaymentStatus;
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
        };
    }>;
    getUserPaymentHistory(query: SearchPaymentDto, user: {
        userId: string;
    }): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: {
            items: {
                user: Omit<import("../users/entities/user.entity").User, "password"> | null;
                servicePurchaseId: import("../ms-purchase/entities/ms-purchase.entity").MsPurchase | null;
                id: string;
                transactionId?: string;
                currency: string;
                gateway: import("./enum/payment.enum").PaymentGateway;
                paymentStatus: import("./enum/payment.enum").PaymentStatus;
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
        };
    }>;
    getPaymentDetails(transactionId: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            userId: Omit<import("../users/entities/user.entity").User, "password"> | null;
            servicePurchaseId: import("../ms-purchase/entities/ms-purchase.entity").MsPurchase | null;
            id: string;
            user: string;
            transactionId?: string;
            currency: string;
            gateway: import("./enum/payment.enum").PaymentGateway;
            paymentStatus: import("./enum/payment.enum").PaymentStatus;
            amount: number;
            discount: number;
            payable: number;
            storeAmount: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
