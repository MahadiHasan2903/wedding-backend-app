import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentGateway, PaymentStatus } from '../enum/payment.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ default: 'usd' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
  })
  gateway: PaymentGateway;

  @Column()
  servicePurchaseId: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  payable: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  storeAmount: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
