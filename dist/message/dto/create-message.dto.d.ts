import { MessageStatus, MessageType } from '../enum/message.enum';
export declare class CreateMessageDto {
    conversationId: string;
    senderId: string;
    receiverId: string;
    message?: string;
    messageType?: MessageType;
    status?: MessageStatus;
    repliedToMessage?: string;
    attachments?: string[];
    needsTranslation?: boolean;
}
