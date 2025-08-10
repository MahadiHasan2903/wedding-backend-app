import { HttpStatus } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SearchContactSubmissionDto } from './dto/search-contact-submission.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/contact.entity").Contact;
    }>;
    findAll(query: SearchContactSubmissionDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {
            items: import("./entities/contact.entity").Contact[];
            totalItems: number;
            itemsPerPage: number;
            currentPage: number;
            totalPages: number;
            hasPrevPage: boolean;
            hasNextPage: boolean;
            prevPage: number | null;
            nextPage: number | null;
        };
    }>;
    findOne(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/contact.entity").Contact;
    }>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/contact.entity").Contact;
    }>;
    remove(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
}
