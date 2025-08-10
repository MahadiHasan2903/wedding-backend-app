import { DataSource, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
export declare class AccountRepository extends Repository<User> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByEmailOrPhone(email: string, phone?: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
