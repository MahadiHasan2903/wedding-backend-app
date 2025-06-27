import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PurchasePackageCategory } from '../enum/ms-purchase.enum';

@Entity()
export class MsPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  packageId: number;

  @Column({ type: 'enum', enum: PurchasePackageCategory })
  purchasePackageCategory: PurchasePackageCategory;

  @Column({ type: 'timestamptz' })
  purchasedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;
}
