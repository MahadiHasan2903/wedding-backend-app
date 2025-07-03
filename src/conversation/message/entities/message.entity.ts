import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Language, MessageType, MessageStatus } from '../enum/message.enum';

export class MessageContent {
  originalText: string;
  sourceLanguage: Language;
  translationEn: string;
  translationFr: string;
  translationEs: string;
}

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

  @Column('json')
  message: MessageContent;

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

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
