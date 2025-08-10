import { DataSource, FindManyOptions } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentFiltersOptions } from '../types/payment.types';
export declare class PaymentRepository {
    private readonly repo;
    constructor(dataSource: DataSource);
    create(data: Partial<Payment>): Payment;
    save(payment: Payment): Promise<Payment>;
    findAll(): Promise<Payment[]>;
    findByUserId(user: string): Promise<Payment[]>;
    findOneByTransactionId(transactionId: string): Promise<Payment | null>;
    findAndCount(options: FindManyOptions<Payment>): Promise<[Payment[], number]>;
    findFilteredAndPaginated(page?: number, pageSize?: number, sort?: string, filters?: PaymentFiltersOptions, userId?: string): Promise<{
        items: Payment[];
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
