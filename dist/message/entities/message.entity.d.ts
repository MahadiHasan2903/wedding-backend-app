import { Language, MessageType, MessageStatus } from '../enum/message.enum';
export declare class MessageContent {
    originalText: string;
    sourceLanguage: Language;
    translationEn: string;
    translationFr: string;
    translationEs: string;
}
export declare class Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    message?: MessageContent;
    messageType: MessageType;
    status: MessageStatus;
    readAt: Date;
    repliedToMessage: string;
    attachments?: string[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
