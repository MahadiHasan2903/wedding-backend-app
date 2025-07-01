import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentRepository {
  private readonly repo: Repository<Payment>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Payment);
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
   *
   * @param user
   * @returns
   */
  findByUserId(user: number): Promise<Payment[]> {
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
}
