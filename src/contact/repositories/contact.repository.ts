import { DataSource, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '../entities/contact.entity';
import { UpdateContactDto } from '../dto/update-contact.dto';

@Injectable()
export class ContactRepository extends Repository<Contact> {
  constructor(private dataSource: DataSource) {
    super(Contact, dataSource.createEntityManager());
  }

  /**
   * Create a new Contact entity instance and save it to the database.
   *
   * @param data Partial contact data to create the entity
   * @returns The saved Contact entity
   */
  async createAndSave(data: Partial<Contact>): Promise<Contact> {
    const contact = this.create(data);
    return this.save(contact);
  }

  /**
   * Retrieve all contact records ordered by creation date descending.
   *
   * @returns Array of all Contact entities sorted by createdAt DESC
   */
  async findAll(): Promise<Contact[]> {
    return this.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a single Contact by its unique ID.
   *
   * @param id UUID string of the Contact
   * @throws NotFoundException if no Contact is found with the given id
   * @returns The found Contact entity
   */
  async findById(id: string): Promise<Contact> {
    const contact = await this.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  /**
   * Update a Contact entity by ID using the provided partial update data, then save.
   *
   * @param id UUID of the Contact to update
   * @param updateDto Partial data for updating the Contact
   * @returns The updated and saved Contact entity
   */
  async updateAndSave(
    id: string,
    updateDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.findById(id);
    const updated = Object.assign(contact, updateDto);
    return this.save(updated);
  }

  /**
   * Delete a Contact entity by its ID.
   *
   * @param id UUID of the Contact to delete
   * @throws NotFoundException if the Contact does not exist
   */
  async deleteById(id: string): Promise<void> {
    const contact = await this.findById(id);
    await this.remove(contact);
  }

  /**
   * Retrieve paginated contacts with sorting.
   *
   * @param page Current page number (1-based)
   * @param pageSize Number of items per page
   * @param sort Sorting criteria string, format: 'field,ASC|DESC' (e.g. 'id,DESC')
   * @returns An object containing:
   *  - items: Array of Contact entities for the current page
   *  - totalItems: Total count of Contact entities in the database
   */
  async findAllPaginated(
    page = 1,
    pageSize = 10,
    sort = 'id,DESC',
  ): Promise<{
    items: Contact[];
    totalItems: number;
  }> {
    const [sortField, sortOrder] = sort.split(',');

    const skip = (page - 1) * pageSize;

    const [items, totalItems] = await this.findAndCount({
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip,
      take: pageSize,
    });

    return { items, totalItems };
  }
}
