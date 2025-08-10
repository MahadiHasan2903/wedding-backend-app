import { ReportType } from '../enum/report.enum';
export declare class Report {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    messageId: string;
    type: ReportType;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
