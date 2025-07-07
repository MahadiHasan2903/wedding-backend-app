import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';
import { UpdateReportDto } from './dto/update-report.dto';
import { PaginationOptions } from 'src/types/common.types';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly reportRepository: ReportsRepository,
    private readonly messageService: MessageService,
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
  async getAllReports({ page, pageSize, sort }: PaginationOptions) {
    const [sortField, sortOrder] = sort.split(',');

    const [reports, totalItems] = await this.reportRepository.findAndCount({
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
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
          messageId: message,
        };
      }),
    );

    return {
      items: itemsWithMessages,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
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
}
