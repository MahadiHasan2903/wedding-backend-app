import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  PaymentStatus,
  PurchasePackageCategory,
  PurchaseStatus,
} from '../enum/ms-purchase.enum';

@Entity('membership_purchases')
export class MsPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: number;

  @Column()
  packageId: number;

  @Column({ type: 'enum', enum: PurchasePackageCategory })
  purchasePackageCategory: PurchasePackageCategory;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  payable: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'timestamptz' })
  purchasedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt?: Date;
}
