import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MsPurchase } from '../entities/ms-purchase.entity';

@Injectable()
export class MsPurchaseRepository extends Repository<MsPurchase> {
  constructor(private dataSource: DataSource) {
    super(MsPurchase, dataSource.createEntityManager());
  }

  /**
   * Find all purchases by a given user ID, ordered by purchase date desc.
   * @param userId The user ID as string.
   * @returns Promise resolving to an array of MsPurchase.
   */
  findByUserId(userId: number): Promise<MsPurchase[]> {
    return this.find({
      where: { userId },
      order: { purchasedAt: 'DESC' },
    });
  }
}
