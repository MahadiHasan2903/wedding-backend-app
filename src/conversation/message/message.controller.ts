import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { UpdateMessageContentDto } from './dto/update-message-content.dto';
import { sanitizeError } from 'src/utils/helpers';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';

@Controller('v1/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   * Create a new message in a conversation.
   * @param dto - The DTO containing senderId, receiverId, conversationId, message body, etc.
   * @returns The created message entity with metadata.
   */
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async create(@Body() dto: CreateMessageDto) {
    try {
      const message = await this.messageService.create(dto);
      return {
        success: true,
        message: 'Message created successfully',
        status: HttpStatus.CREATED,
        data: message,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: 'Failed to create message',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve all messages for a given conversation ID.
   * @param conversationId - The UUID of the conversation to fetch messages for.
   * @returns List of messages sorted by creation time (ASC).
   */
  @Get('conversation/:conversationId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getByConversationId(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    try {
      const messages =
        await this.messageService.findByConversationId(conversationId);
      return {
        success: true,
        message: 'Messages fetched successfully',
        status: HttpStatus.OK,
        data: messages,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: `Failed to fetch messages for conversationId: ${conversationId}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update the multilingual message content of a specific message by ID.
   * @param id - UUID of the message to update.
   * @param dto - Contains the updated message text and translations.
   * @returns The updated message entity.
   */
  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateMessageContent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMessageContentDto,
  ) {
    try {
      const updatedMessage = await this.messageService.updateMessageContent(
        id,
        dto,
      );

      return {
        success: true,
        message: 'Message content updated successfully',
        status: HttpStatus.OK,
        data: updatedMessage,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `Failed to update message content for ID ${id}`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Soft-delete or restore a message by toggling its `isDeleted` status.
   * @param id - UUID of the message to update.
   * @param dto - DTO containing the boolean flag `isDeleted`.
   * @returns The updated message with the new deletion status.
   */
  @Patch(':id/is-deleted')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateIsDeleted(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMessageStatusDto,
  ) {
    try {
      const updated = await this.messageService.updateIsDeleted(id, dto);
      return {
        success: true,
        message: 'Message deletion status updated',
        status: HttpStatus.OK,
        data: updated,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          success: false,
          message: `Failed to update isDeleted for message ID: ${id}`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
