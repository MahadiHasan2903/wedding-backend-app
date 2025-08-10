import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './repositories/contact.repository';
import { EmailService } from 'src/common/email/email.service';
export declare class ContactService {
    private readonly contactRepository;
    private readonly emailService;
    constructor(contactRepository: ContactRepository, emailService: EmailService);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    private sendContactNotificationToAdmin;
    findAll(page?: number, pageSize?: number, sort?: string): Promise<{
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
    findOne(id: string): Promise<Contact>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<Contact>;
    remove(id: string): Promise<void>;
}
