import * as fs from 'fs';
import * as path from 'path';
import { Report } from './entities/report.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Between, FindOptionsWhere } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateReportDto } from './dto/update-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { AccountStatus } from 'src/users/enum/users.enum';
import { ReportFiltersOptions } from './types/report.types';
import { MessageService } from 'src/message/message.service';
import { EmailService } from 'src/common/email/email.service';
import { ReportAction, ReportStatus } from './enum/report.enum';
import { ReportsRepository } from './repositories/reports.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportsRepository,
    private readonly messageService: MessageService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new abuse report and stores it in the database.
   *
   * @param createReportDto - Contains information about the reported conversation,
   *                          sender, receiver, type of report, and optional description.
   * @returns The created report entity.
   */
  async createReport(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportRepository.create(createReportDto);
    return this.reportRepository.save(report);
  }

  /**
   * Fetches all abuse reports with pagination and sorting support.
   *
   * @param page - Current page number.
   * @param pageSize - Number of items per page.
   * @param sort - Sorting string in the format: "field,DESC" or "field,ASC".
   * @returns An object containing paginated results and metadata.
   */
  async getAllReports(
    page = 1,
    pageSize = 10,
    sort = 'createdAt,DESC',
    filters: ReportFiltersOptions = {},
  ) {
    let [sortField, sortOrder] = sort.split(',');
    sortField = sortField || 'createdAt';
    sortOrder = sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const where: FindOptionsWhere<Report> = {};

    // Handle dateRange if provided
    if (filters.dateRange) {
      const [start, end] = filters.dateRange.split(' - ');
      where.createdAt = Between(new Date(start), new Date(end));
    }

    const [reports, totalItems] = await this.reportRepository.findAndCount({
      where,
      order: {
        [sortField]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Load full message for each report
    const itemsWithMessages = await Promise.all(
      reports.map(async (report) => {
        const message = await this.messageService.findById(report.messageId);
        return {
          ...report,
          message, // 👈 better than overwriting messageId
        };
      }),
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: itemsWithMessages,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  /**
   * Retrieves a single report by its unique ID.
   *
   * @param id - UUID of the report to retrieve.
   * @throws NotFoundException if the report does not exist.
   * @returns The matched report entity.
   */
  async getReportById(id: string) {
    const report = await this.reportRepository.findOne({
      where: { id },
    });

    if (!report) throw new NotFoundException(`Report with ID ${id} not found`);

    const message = await this.messageService.findById(report.messageId);

    return {
      ...report,
      messageId: message,
    };
  }

  /**
   * Updates an existing report by merging provided fields.
   *
   * @param id - UUID of the report to update.
   * @param updateReportDto - Partial update payload for the report.
   * @throws NotFoundException if the report does not exist.
   * @returns The updated report entity.
   */
  async updateReport(
    id: string,
    updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    // Only assign update DTO fields — skip any expanded relations
    Object.assign(report, updateReportDto);

    return this.reportRepository.save(report);
  }

  /**
   * Deletes a report by its ID.
   *
   * @param id - UUID of the report to delete.
   * @throws NotFoundException if the report does not exist.
   */
  async deleteReport(id: string): Promise<void> {
    const result = await this.reportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }

  /**
   * Apply an action (warn, ban, etc.) to a report and optionally notify the user.
   *
   * @param reportId - UUID of the report
   * @param action - The action to take (pending, looks_fine, ban_user, warn_user)
   * @returns The updated report entity
   *
   */

  async takeAction(reportId: string, action: ReportAction) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });
    if (!report)
      throw new HttpException('Report not found', HttpStatus.NOT_FOUND);

    report.actionTaken = action;
    report.status =
      action === ReportAction.PENDING
        ? ReportStatus.PENDING
        : ReportStatus.RESOLVED;

    if ([ReportAction.WARNED_USER, ReportAction.BANNED_USER].includes(action)) {
      const user = await this.usersService.findUserById(report.senderId);
      if (!user || !user.email)
        throw new HttpException(
          'Sender email not found',
          HttpStatus.BAD_REQUEST,
        );

      let templateFile = '';
      let subject = '';

      if (action === ReportAction.WARNED_USER) {
        templateFile = 'warn-user.html';
        subject = '⚠️ Warning Notice - France & Cuba Wedding App';
      } else if (action === ReportAction.BANNED_USER) {
        templateFile = 'banned-user.html';
        subject = '🚫 Account Banned - France & Cuba Wedding App';
        await this.usersService.updateAccountStatus(
          user.id,
          AccountStatus.BANNED,
        );
      }

      const templatePath = path.join(
        __dirname,
        '..',
        'common',
        'email',
        'templates',
        templateFile,
      );
      let html = fs.readFileSync(templatePath, 'utf-8');
      html = html.replace('{{FIRST_NAME}}', user.firstName ?? 'User');

      // 📧 Send email (warn or ban)
      await this.emailService.sendMail({ to: user.email, subject, html });
    }

    // 4️⃣ Save and return updated report
    return this.reportRepository.save(report);
  }
}
