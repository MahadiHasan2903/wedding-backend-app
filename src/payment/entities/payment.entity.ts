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

  @Column({ type: 'uuid' })
  packageId: string;

  @Column({ nullable: true })
  packageCategory?: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: PaymentGateway,
  })
  gateway: PaymentGateway;

  @Column({ type: 'jsonb' })
  paymentInfo: Record<string, any>;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ default: 'use' })
  currency: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ type: 'boolean', default: true })
  isTestMode: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
