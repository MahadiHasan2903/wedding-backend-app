import { HttpStatus } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
export declare class ReportsController {
    private readonly reportService;
    constructor(reportService: ReportsService);
    createReport(createReportDto: CreateReportDto): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/report.entity").Report;
    }>;
    getAllReports(page?: number, pageSize?: number, sort?: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            items: {
                messageId: {
                    attachments: import("../media/entities/media.entity").Media[];
                    id: string;
                    conversationId: string;
                    senderId: string;
                    receiverId: string;
                    message?: import("../message/entities/message.entity").MessageContent;
                    messageType: import("../message/enum/message.enum").MessageType;
                    status: import("../message/enum/message.enum").MessageStatus;
                    readAt: Date;
                    repliedToMessage: string;
                    isDeleted: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                } | null;
                id: string;
                conversationId: string;
                senderId: string;
                receiverId: string;
                type: import("./enum/report.enum").ReportType;
                description?: string;
                createdAt: Date;
                updatedAt: Date;
            }[];
            totalItems: number;
            itemsPerPage: number;
            currentPage: number;
            totalPages: number;
            hasPrevPage: boolean;
            hasNextPage: boolean;
            prevPage: number | null;
            nextPage: number | null;
        };
    }>;
    getReportById(id: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {
            messageId: {
                attachments: import("../media/entities/media.entity").Media[];
                id: string;
                conversationId: string;
                senderId: string;
                receiverId: string;
                message?: import("../message/entities/message.entity").MessageContent;
                messageType: import("../message/enum/message.enum").MessageType;
                status: import("../message/enum/message.enum").MessageStatus;
                readAt: Date;
                repliedToMessage: string;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            id: string;
            conversationId: string;
            senderId: string;
            receiverId: string;
            type: import("./enum/report.enum").ReportType;
            description?: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateReport(id: string, updateReportDto: UpdateReportDto): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/report.entity").Report;
    }>;
    deleteReport(id: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {};
    }>;
}
