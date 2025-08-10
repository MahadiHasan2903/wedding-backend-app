import { DataSource, Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { Language } from '../enum/message.enum';
export interface MessageContent {
    originalText: string;
    sourceLanguage: Language;
    translationEn: string;
    translationFr: string;
    translationEs: string;
}
export declare class MessageRepository extends Repository<Message> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findById(id: string): Promise<Message | null>;
    findByConversationId(conversationId: string): Promise<Message[]>;
    updateMessageDeletionStatus(id: string, isDeleted: boolean): Promise<Message>;
    updateMessageContent(id: string, content: MessageContent): Promise<Message>;
}
