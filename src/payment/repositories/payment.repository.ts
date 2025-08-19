import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { PaymentFiltersOptions } from '../types/payment.types';

@Injectable()
export class PaymentRepository {
  private readonly repo: Repository<Payment>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Payment);
  }

  /**
   * Creates and returns a TypeORM QueryBuilder instance for the Payment entity.
   * @param {string} [alias='payment'] - The table alias to use in the query builder.
   * @returns {SelectQueryBuilder<Payment>} A query builder instance for building custom queries.
   */
  createQueryBuilder(alias = 'payment') {
    return this.repo.createQueryBuilder(alias);
  }

  /**
   * Create a new Payment entity instance (not saved to DB yet)
   * @param data Partial Payment data
   */
  create(data: Partial<Payment>): Payment {
    return this.repo.create(data);
  }

  /**
   * Save a Payment entity to the database
   * @param payment Payment entity
   */
  save(payment: Payment): Promise<Payment> {
    return this.repo.save(payment);
  }

  /**
   *Find all the payments from
   * @returns Promise resolving to Payment[] or undefined if not found
   */
  findAll(): Promise<Payment[]> {
    return this.repo.find();
  }

  /**
   * Retrieves all payment records associated with the given user ID.
   * @param {string} user - The ID of the user whose payments should be retrieved.
   * @returns {Promise<Payment[]>} A promise that resolves to an array of payment entities.
   */
  findByUserId(user: string): Promise<Payment[]> {
    return this.repo.find({ where: { user } });
  }

  /**
   * Find a payment by its transaction ID
   * @param transactionId The Stripe transaction or checkout session ID
   * @returns Promise resolving to Payment or undefined if not found
   */
  findOneByTransactionId(transactionId: string): Promise<Payment | null> {
    return this.repo.findOne({ where: { transactionId } });
  }

  /**
   * Find and count all payments with optional filters (pagination + sorting)
   */
  findAndCount(
    options: FindManyOptions<Payment>,
  ): Promise<[Payment[], number]> {
    return this.repo.findAndCount(options);
  }

  /**
   * Finds payments with optional filters, sorting, and pagination.
   *
   * @param {number} page - The current page number (default: 1).
   * @param {number} pageSize - The number of items per page (default: 10).
   * @param {string} sort - Sorting format as "field,ORDER" (e.g., "id,DESC").
   * @param {PaymentFiltersOptions} filters - Optional filters:
   * @param {string} [userId] - Optional user ID to filter payments by specific user.
   *
   * @returns An object containing the paginated payment results and pagination metadata.
   */
  async findFilteredAndPaginated(
    page = 1,
    pageSize = 10,
    sort = 'createdAt,DESC',
    filters: PaymentFiltersOptions = {},
    userId?: string,
  ) {
    const [sortField, sortOrder] = sort.split(',');

    const qb = this.repo.createQueryBuilder('payment');

    if (userId) {
      qb.andWhere('payment.user = :userId', { userId });
    }

    // Apply other filters
    if (filters.gateway) {
      qb.andWhere('payment.gateway = :gateway', { gateway: filters.gateway });
    }

    if (filters.paymentStatus) {
      qb.andWhere('payment.paymentStatus = :paymentStatus', {
        paymentStatus: filters.paymentStatus,
      });
    }

    if (filters.dateRange?.includes(' - ')) {
      const [startDateStr, endDateStr] = filters.dateRange.split(' - ');
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        endDate.setHours(23, 59, 59, 999);
        qb.andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }
    }

    // Sorting
    qb.orderBy(
      `payment.${sortField}`,
      sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    // Pagination
    const skip = (page - 1) * pageSize;
    qb.skip(skip).take(pageSize);

    const [items, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / pageSize);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      items,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }
}
