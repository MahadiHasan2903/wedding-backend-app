import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateLastMessageDto } from './dto/update-last-message.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';
import { sanitizeError } from 'src/utils/helpers';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('v1/conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  /**
   * Create a new conversation between a sender and a receiver.
   * Accessible to users with roles: USER and ADMIN.
   *
   * @param dto - Contains senderId and receiverId
   * @returns The created conversation object
   */
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async createConversation(@Body() dto: CreateConversationDto) {
    try {
      const conversation =
        await this.conversationService.createConversation(dto);

      return {
        success: true,
        message: 'Conversation created successfully',
        status: HttpStatus.CREATED,
        data: conversation,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to create conversation',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve all conversations for the currently logged-in user.
   *
   * Accessible to users with roles: USER and ADMIN.
   *
   * @param user - The currently authenticated user (injected via @CurrentUser decorator)
   * @returns Array of conversations associated with the logged-in user
   */
  @Get('my-conversations')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getConversationsBySenderId(@CurrentUser() user: { userId: string }) {
    try {
      const conversations = await this.conversationService.findBySenderId(
        user.userId,
      );

      return {
        success: true,
        message: 'Conversations fetched successfully',
        status: HttpStatus.OK,
        data: conversations,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `Failed to fetch conversations for this account`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve a specific conversation by its ID and senderId.
   * Accessible to users with roles: USER and ADMIN.
   *
   * @param id - The UUID of the conversation
   * @param senderId - The UUID of the sender (passed via query param)
   * @returns The matched conversation
   */
  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getConversationByIdAndSender(
    @Param('id') id: string,
    @Query('senderId') senderId: string,
  ) {
    try {
      const conversation = await this.conversationService.findByIdAndSender(
        id,
        senderId,
      );

      return {
        success: true,
        message: 'Conversation fetched successfully',
        status: HttpStatus.OK,
        data: conversation,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `Failed to fetch conversation with ID ${id} and senderId ${senderId}`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update the last message content and ID in a conversation.
   * Accessible to users with roles: USER and ADMIN.
   *
   * @param id - The UUID of the conversation to update
   * @param dto - Contains the lastMessageId and lastMessage text
   * @returns The updated conversation
   */
  @Patch(':id/last-message')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateLastMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLastMessageDto,
  ) {
    try {
      const updatedConversation =
        await this.conversationService.updateLastMessage(id, dto);

      return {
        success: true,
        message: 'Last message updated successfully',
        status: HttpStatus.OK,
        data: updatedConversation,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `Failed to update last message for conversation ID ${id}`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve all conversations for a specific senderId (passed as route param).
   * This is an alternative to the query-based version.
   *
   * @param senderId - The UUID of the sender
   * @returns Array of conversations for the specified sender
   */
  @Get('sender/:senderId')
  async getConversationsBySender(
    @Param('senderId', ParseUUIDPipe) senderId: string,
  ) {
    try {
      const conversations =
        await this.conversationService.findBySenderId(senderId);

      return {
        success: true,
        message: `Conversations fetched for senderId: ${senderId}`,
        status: HttpStatus.OK,
        data: conversations,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `Failed to fetch conversations for senderId: ${senderId}`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
