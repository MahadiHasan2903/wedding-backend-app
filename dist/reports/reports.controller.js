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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const create_report_dto_1 = require("./dto/create-report.dto");
const update_report_dto_1 = require("./dto/update-report.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const users_enum_1 = require("../users/enum/users.enum");
const helpers_1 = require("../utils/helpers");
let ReportsController = class ReportsController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async createReport(createReportDto) {
        try {
            const report = await this.reportService.createReport(createReportDto);
            return {
                success: true,
                message: 'Report created successfully',
                status: common_1.HttpStatus.CREATED,
                data: report,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to create report',
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllReports(page = 1, pageSize = 10, sort = 'id,DESC') {
        try {
            const reports = await this.reportService.getAllReports({
                page: Number(page),
                pageSize: Number(pageSize),
                sort,
            });
            return {
                success: true,
                message: 'Reports fetched successfully',
                status: common_1.HttpStatus.OK,
                data: reports,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: 'Failed to fetch reports',
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getReportById(id) {
        try {
            const report = await this.reportService.getReportById(id);
            return {
                success: true,
                message: `Report fetched successfully`,
                status: common_1.HttpStatus.OK,
                data: report,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: `Failed to fetch report with ID: ${id}`,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateReport(id, updateReportDto) {
        try {
            const updated = await this.reportService.updateReport(id, updateReportDto);
            return {
                success: true,
                message: `Report updated successfully`,
                status: common_1.HttpStatus.OK,
                data: updated,
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: `Failed to update report with ID: ${id}`,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteReport(id) {
        try {
            await this.reportService.deleteReport(id);
            return {
                success: true,
                message: `Report deleted successfully`,
                status: common_1.HttpStatus.OK,
                data: {},
            };
        }
        catch (error) {
            const sanitizedError = (0, helpers_1.sanitizeError)(error);
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException({
                success: false,
                message: `Failed to delete report with ID: ${id}`,
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: sanitizedError,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_report_dto_1.UpdateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateReport", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "deleteReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('v1/reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map