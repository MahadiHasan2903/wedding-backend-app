import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Report } from '../entities/report.entity';

@Injectable()
export class ReportsRepository extends Repository<Report> {
  /**
   * Constructs a ReportsRepository using the provided DataSource.
   * This initializes the base Repository with the Report entity
   * and its associated EntityManager.
   *
   * @param dataSource - The TypeORM DataSource used to create the entity manager.
   */
  constructor(private readonly dataSource: DataSource) {
    super(Report, dataSource.createEntityManager());
  }

  /**
   * Find and count all reports with optional filters (pagination + sorting)
   */
  override findAndCount(
    options: FindManyOptions<Report>,
  ): Promise<[Report[], number]> {
    return super.findAndCount(options);
  }
}
