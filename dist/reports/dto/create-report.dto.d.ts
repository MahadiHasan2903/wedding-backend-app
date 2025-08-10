import { ReportType } from '../enum/report.enum';
export declare class CreateReportDto {
    conversationId: string;
    senderId: string;
    receiverId: string;
    messageId: string;
    type: ReportType;
    description?: string;
}
