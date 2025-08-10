import { ReportsRepository } from './repositories/reports.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { UpdateReportDto } from './dto/update-report.dto';
import { PaginationOptions } from 'src/types/common.types';
import { MessageService } from 'src/message/message.service';
export declare class ReportsService {
    private readonly reportRepository;
    private readonly messageService;
    constructor(reportRepository: ReportsRepository, messageService: MessageService);
    createReport(createReportDto: CreateReportDto): Promise<Report>;
    getAllReports({ page, pageSize, sort }: PaginationOptions): Promise<{
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
    }>;
    getReportById(id: string): Promise<{
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
    }>;
    updateReport(id: string, updateReportDto: UpdateReportDto): Promise<Report>;
    deleteReport(id: string): Promise<void>;
}
