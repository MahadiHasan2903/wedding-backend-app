import { DataSource, Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
export declare class ConversationRepository extends Repository<Conversation> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findBySenderId(senderId: string): Promise<Conversation[]>;
    findByConversationId(id: string): Promise<Conversation | null>;
    updateLastMessage(id: string, lastMessageId: string, lastMessage: string): Promise<Conversation>;
}
