import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { sanitizeError } from 'src/utils/helpers';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';
import { SearchContactSubmissionDto } from './dto/search-contact-submission.dto';

@Controller('v1/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  /**
   * Public endpoint to submit a new contact form.
   *
   * @param createContactDto - Data from contact form submission
   * @returns Response with success status and saved contact data
   * @throws HttpException with BAD_REQUEST on failure
   */
  @Public()
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      const contact = await this.contactService.create(createContactDto);
      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'Contact submitted successfully',
        data: contact,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to submit contact',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Admin-only endpoint to retrieve paginated contact submissions.
   *
   * @param query - Query parameters including page, pageSize, and sort
   * @returns Response with paginated list of contacts and metadata
   * @throws HttpException with INTERNAL_SERVER_ERROR on failure
   */
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() query: SearchContactSubmissionDto) {
    const { page, pageSize, sort } = query;

    try {
      const contacts = await this.contactService.findAll(page, pageSize, sort);
      return {
        status: HttpStatus.OK,
        success: true,
        message: 'All contact submissions retrieved',
        data: contacts,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to retrieve contacts',
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Admin-only endpoint to get details of a specific contact submission by ID.
   *
   * @param id - UUID of the contact submission
   * @returns Response with contact details
   * @throws HttpException with NOT_FOUND if contact not found
   */
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const contact = await this.contactService.findOne(id);
      return {
        status: HttpStatus.OK,
        success: true,
        message: `Contact details retrieved`,
        data: contact,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: `Contact details not found`,
          error: sanitizedError,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Admin-only endpoint to update a contact submission by ID.
   *
   * @param id - UUID of the contact submission
   * @param updateContactDto - Partial data to update the contact submission
   * @returns Response with updated contact data
   * @throws HttpException with BAD_REQUEST on failure
   */
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    try {
      const updated = await this.contactService.update(id, updateContactDto);
      return {
        status: HttpStatus.OK,
        success: true,
        message: `Contact with ID ${id} updated`,
        data: updated,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: `Failed to update contact with ID ${id}`,
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Admin-only endpoint to delete a contact submission by ID.
   *
   * @param id - UUID of the contact submission to delete
   * @returns Response with success status
   * @throws HttpException with BAD_REQUEST on failure
   */
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.contactService.remove(id);
      return {
        status: HttpStatus.OK,
        success: true,
        message: `Contact deleted successfully`,
        data: {},
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: `Failed to delete contact with ID ${id}`,
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
