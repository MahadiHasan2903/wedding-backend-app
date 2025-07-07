import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';
import { sanitizeError } from 'src/utils/helpers';

@Controller('v1/reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  /**
   * Create a new abuse report.
   * Accessible by users and admins.
   *
   * @param createReportDto - Data for creating a new report (conversationId, senderId, etc.)
   * @returns The newly created report along with success metadata
   */
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async createReport(@Body() createReportDto: CreateReportDto) {
    try {
      const report = await this.reportService.createReport(createReportDto);
      return {
        success: true,
        message: 'Report created successfully',
        status: HttpStatus.CREATED,
        data: report,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: 'Failed to create report',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve all reports with pagination and sorting.
   * Admin-only access.
   *
   * @param page - Current page number (default: 1)
   * @param pageSize - Number of items per page (default: 10)
   * @param sort - Sort format: 'field,order' (e.g., 'id,DESC')
   * @returns Paginated list of reports
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async getAllReports(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('sort') sort = 'id,DESC',
  ) {
    try {
      const reports = await this.reportService.getAllReports({
        page: Number(page),
        pageSize: Number(pageSize),
        sort,
      });
      return {
        success: true,
        message: 'Reports fetched successfully',
        status: HttpStatus.OK,
        data: reports,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch reports',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve a single report by its unique ID.
   * Admin-only access.
   *
   * @param id - UUID of the report to retrieve
   * @returns Report data if found
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getReportById(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const report = await this.reportService.getReportById(id);
      return {
        success: true,
        message: `Report fetched successfully`,
        status: HttpStatus.OK,
        data: report,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: `Failed to fetch report with ID: ${id}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing report by its ID.
   * Accessible by users and admins.
   *
   * @param id - UUID of the report to update
   * @param updateReportDto - Partial report data to update (e.g., type, description)
   * @returns Updated report object
   */
  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    try {
      const updated = await this.reportService.updateReport(
        id,
        updateReportDto,
      );
      return {
        success: true,
        message: `Report updated successfully`,
        status: HttpStatus.OK,
        data: updated,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: `Failed to update report with ID: ${id}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a report by its ID.
   * Admin-only access.
   *
   * @param id - UUID of the report to delete
   * @returns Success message if deletion succeeds
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteReport(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.reportService.deleteReport(id);
      return {
        success: true,
        message: `Report deleted successfully`,
        status: HttpStatus.OK,
        data: {},
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: `Failed to delete report with ID: ${id}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
