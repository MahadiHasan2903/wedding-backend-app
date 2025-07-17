import { Injectable } from '@nestjs/common';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactRepository } from './repositories/contact.repository';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Create a new contact submission.
   * Sends a notification email to admin before saving the contact data.
   *
   * @param createContactDto - Data submitted from the contact form
   * @returns The saved Contact entity
   * @throws Error if email notification or saving fails
   */
  async create(createContactDto: CreateContactDto): Promise<Contact> {
    try {
      await this.sendContactNotificationToAdmin(createContactDto);
      return this.contactRepository.createAndSave(createContactDto);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to notify admin: ${msg}`);
    }
  }

  /**
   * Helper method to send contact submission details to the admin via email.
   *
   * @param contact - Contact data to include in the email
   */
  private async sendContactNotificationToAdmin(contact: CreateContactDto) {
    const { firstName, lastName, email, phoneNumber, subject, message } =
      contact;

    const html = `
      <p><strong>New contact submission received:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        ${phoneNumber ? `<li><strong>Phone:</strong> ${phoneNumber}</li>` : ''}
        <li><strong>Subject:</strong> ${subject}</li>
        <li><strong>Message:</strong><br/>${message}</li>
      </ul>
      <p>— France Cuba Wedding App</p>
    `;

    await this.emailService.sendMail({
      from: email,
      subject: '📩 New Contact Form Submission',
      html,
    });
  }

  /**
   * Retrieve paginated list of contact submissions with sorting.
   *
   * @param page - Current page number (default 1)
   * @param pageSize - Number of items per page (default 10)
   * @param sort - Sorting criteria string in the format 'field,ASC|DESC' (default 'id,DESC')
   * @returns Paginated response object with items and metadata
   */
  async findAll(page = 1, pageSize = 10, sort = 'id,DESC') {
    const { items, totalItems } = await this.contactRepository.findAllPaginated(
      page,
      pageSize,
      sort,
    );

    return {
      items,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  /**
   * Find a contact submission by its ID.
   *
   * @param id - UUID of the contact submission
   * @returns The found Contact entity
   * @throws NotFoundException if contact does not exist
   */
  async findOne(id: string): Promise<Contact> {
    return this.contactRepository.findById(id);
  }

  /**
   * Update a contact submission by ID with the provided partial data.
   *
   * @param id - UUID of the contact submission
   * @param updateContactDto - Partial data to update the contact
   * @returns The updated Contact entity
   */
  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactRepository.updateAndSave(id, updateContactDto);
  }

  /**
   * Delete a contact submission by ID.
   *
   * @param id - UUID of the contact submission to delete
   */
  async remove(id: string): Promise<void> {
    return this.contactRepository.deleteById(id);
  }
}
