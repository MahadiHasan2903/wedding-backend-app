import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportType } from '../enum/report.enum';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column()
  messageId: string;

  @Column({
    type: 'enum',
    enum: ReportType,
    default: ReportType.OTHER,
  })
  type: ReportType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
