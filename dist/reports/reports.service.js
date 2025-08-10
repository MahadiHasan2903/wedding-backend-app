"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const reports_repository_1 = require("./repositories/reports.repository");
const message_service_1 = require("../message/message.service");
let ReportsService = class ReportsService {
    reportRepository;
    messageService;
    constructor(reportRepository, messageService) {
        this.reportRepository = reportRepository;
        this.messageService = messageService;
    }
    async createReport(createReportDto) {
        const report = this.reportRepository.create(createReportDto);
        return this.reportRepository.save(report);
    }
    async getAllReports({ page, pageSize, sort }) {
        const [sortField, sortOrder] = sort.split(',');
        const [reports, totalItems] = await this.reportRepository.findAndCount({
            order: {
                [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        const itemsWithMessages = await Promise.all(reports.map(async (report) => {
            const message = await this.messageService.findById(report.messageId);
            return {
                ...report,
                messageId: message,
            };
        }));
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            items: itemsWithMessages,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
    async getReportById(id) {
        const report = await this.reportRepository.findOne({
            where: { id },
        });
        if (!report)
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        const message = await this.messageService.findById(report.messageId);
        return {
            ...report,
            messageId: message,
        };
    }
    async updateReport(id, updateReportDto) {
        const report = await this.reportRepository.findOne({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
        Object.assign(report, updateReportDto);
        return this.reportRepository.save(report);
    }
    async deleteReport(id) {
        const result = await this.reportRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Report with ID ${id} not found`);
        }
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reports_repository_1.ReportsRepository,
        message_service_1.MessageService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map