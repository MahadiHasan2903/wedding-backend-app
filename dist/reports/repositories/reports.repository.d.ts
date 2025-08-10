import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Report } from '../entities/report.entity';
export declare class ReportsRepository extends Repository<Report> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findAndCount(options: FindManyOptions<Report>): Promise<[Report[], number]>;
}
