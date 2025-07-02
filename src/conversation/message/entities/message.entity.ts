import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MessageType, MessageStatus } from '../enum/message.enum';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column('text')
  originalText: string;

  @Column({ type: 'text', nullable: true })
  translatedEnglish: string;

  @Column({ type: 'text', nullable: true })
  translatedFrench: string;

  @Column({ type: 'text', nullable: true })
  translatedSpanish: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  readAt: Date;

  @Column({ nullable: true })
  replyToMessageId: number;

  @Column({ type: 'jsonb', nullable: true })
  attachments: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
