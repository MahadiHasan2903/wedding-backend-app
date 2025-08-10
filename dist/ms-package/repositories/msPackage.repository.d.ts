import { DataSource, Repository } from 'typeorm';
import { MsPackage } from '../entities/msPackage.entity';
export declare class MsPackageRepository extends Repository<MsPackage> {
    private dataSource;
    constructor(dataSource: DataSource);
}
