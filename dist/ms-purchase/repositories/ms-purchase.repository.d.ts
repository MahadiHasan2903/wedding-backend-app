import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { MsPurchase } from '../entities/ms-purchase.entity';
export declare class MsPurchaseRepository extends Repository<MsPurchase> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByUserId(user: string): Promise<MsPurchase[]>;
    findAndCount(options: FindManyOptions<MsPurchase>): Promise<[MsPurchase[], number]>;
}
