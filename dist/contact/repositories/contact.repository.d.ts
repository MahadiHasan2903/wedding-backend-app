import { DataSource, Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { UpdateContactDto } from '../dto/update-contact.dto';
export declare class ContactRepository extends Repository<Contact> {
    private dataSource;
    constructor(dataSource: DataSource);
    createAndSave(data: Partial<Contact>): Promise<Contact>;
    findAll(): Promise<Contact[]>;
    findById(id: string): Promise<Contact>;
    updateAndSave(id: string, updateDto: UpdateContactDto): Promise<Contact>;
    deleteById(id: string): Promise<void>;
    findAllPaginated(page?: number, pageSize?: number, sort?: string): Promise<{
        items: Contact[];
        totalItems: number;
        itemsPerPage: number;
        currentPage: number;
        totalPages: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    }>;
}
