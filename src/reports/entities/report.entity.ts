import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportStatus, ReportAction, ReportType } from '../enum/report.enum';

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

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
    nullable: true,
  })
  status?: ReportStatus;

  @Column({
    type: 'enum',
    enum: ReportAction,
    default: ReportAction.PENDING,
    nullable: true,
  })
  actionTaken?: ReportAction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
