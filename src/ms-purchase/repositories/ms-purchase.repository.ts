import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MsPurchase } from '../entities/ms-purchase.entity';

@Injectable()
export class MsPurchaseRepository extends Repository<MsPurchase> {
  constructor(private dataSource: DataSource) {
    super(MsPurchase, dataSource.createEntityManager());
  }

  /**
   * Find all purchases by a given user ID, ordered by purchase date desc.
   * @param user The user ID as string.
   * @returns Promise resolving to an array of MsPurchase.
   */
  findByUserId(user: string): Promise<MsPurchase[]> {
    return this.find({
      where: { user },
      order: { purchasedAt: 'DESC' },
    });
  }

  /**
   * Find and count all purchases with optional filters (pagination + sorting)
   */
  override findAndCount(
    options: FindManyOptions<MsPurchase>,
  ): Promise<[MsPurchase[], number]> {
    return super.findAndCount(options);
  }
}
