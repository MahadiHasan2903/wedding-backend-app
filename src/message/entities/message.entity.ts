import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
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

  @Column('json', { nullable: true })
  message?: MessageContent;

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
  repliedToMessage: string;

  @Column({ type: 'uuid', array: true, nullable: true })
  attachments?: string[];

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isInappropriate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
