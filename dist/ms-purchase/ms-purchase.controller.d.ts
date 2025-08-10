import { HttpStatus } from '@nestjs/common';
import { MsPurchaseService } from './ms-purchase.service';
import { CreateMsPurchaseDto } from './dto/create-ms-purchase.dto';
export declare class MsPurchaseController {
    private readonly msPurchaseService;
    constructor(msPurchaseService: MsPurchaseService);
    getMyPurchases(page: number | undefined, pageSize: number | undefined, sort: string | undefined, user: {
        userId: string;
    }): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            items: import("./entities/ms-purchase.entity").MsPurchase[];
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
    create(user: {
        userId: string;
    }, createDto: CreateMsPurchaseDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            membershipPackageInfo: {
                id: number;
                title: string;
                description: string[];
                categoryInfo: import("../ms-package/entities/msPackage.entity").CategoryInfo;
            };
            id: string;
            user: string;
            amount: number;
            discount: number;
            payable: number;
            status: import("./enum/ms-purchase.enum").PurchaseStatus;
            paymentStatus: import("./enum/ms-purchase.enum").PaymentStatus;
            purchasedAt: Date;
            expiresAt?: Date;
        };
    }>;
    getOne(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/ms-purchase.entity").MsPurchase;
    }>;
    getAll(page?: number, pageSize?: number, sort?: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            items: import("./entities/ms-purchase.entity").MsPurchase[];
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
    delete(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
}
