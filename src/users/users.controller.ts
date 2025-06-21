import {
  Controller,
  Patch,
  Param,
  Body,
  UseInterceptors,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  UploadedFiles,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enum/users.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { sanitizeError } from 'src/utils/helpers';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DeletePhotoDto } from 'src/common/media/dto/delete-photo.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get the logged-in user's profile using ID from token.
   *
   * @param user - Injected user from token.
   * @returns The user's profile excluding sensitive info.
   */
  @Get('profile')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getProfile(@CurrentUser() user: { id: number }) {
    try {
      const foundUser = await this.usersService.findById(user.id);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: foundUser,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to retrieve profile',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get user profile by ID (admin or elevated access).
   *
   * @param id - The user ID to look up.
   * @returns The user's profile excluding password.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const foundUser = await this.usersService.findById(id);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: foundUser,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to retrieve user',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Updates a user's profile, including uploading a new profile picture if provided.
   *
   * @param id - The user's unique ID from the route parameter.
   * @param updateUserDto - DTO containing fields to update on the user.
   * @param file - Optional uploaded profile image file (from multipart/form-data).
   * @returns A response object with status, success flag, message, and updated user data (excluding password).
   *
   * @throws HttpException - If an error occurs during the update, a 400 Bad Request is thrown with error details.
   */
  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'additionalPhotos', maxCount: 10 },
    ]),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      additionalPhotos?: Express.Multer.File[];
    },
  ) {
    try {
      const user = await this.usersService.update(id, updateUserDto, files);
      const { password, ...safeUser } = user;

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: safeUser,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update user',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Delete a specific photo from user's additionalPhotos.
   */
  @Delete(':id/additional-photo')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async deleteAdditionalPhoto(
    @Param('id', ParseIntPipe) id: number,
    @Body() deletePhotoDto: DeletePhotoDto,
  ) {
    try {
      const updatedUser = await this.usersService.deleteAdditionalPhoto(
        id,
        deletePhotoDto.photoUrl,
      );
      const { password, ...safeUser } = updatedUser;

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Photo deleted successfully',
        data: safeUser,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to delete photo',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Updates the logged-in user's account status.
   * @param user - The currently authenticated user object injected from the token (contains user id).
   * @param updateAccountStatusDto - DTO containing the new account status.
   *
   * @returns A response object containing the updated user data (excluding the password).
   *
   * @throws HttpException with status 400 if the update fails for any reason.
   */
  @Patch('profile/account-status')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateAccountStatus(
    @CurrentUser() user: { id: number },
    @Body() updateAccountStatusDto: UpdateAccountStatusDto,
  ) {
    try {
      console.log('Triggered');
      // Call service method to update the account status of the current user
      const updatedUser = await this.usersService.updateAccountStatus(
        user.id,
        updateAccountStatusDto.accountStatus,
      );

      // Exclude the password field before sending the response
      const { password, ...safeUser } = updatedUser;

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Account status updated successfully',
        data: safeUser,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update account status',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Admin-only endpoint to update account status of any user by user ID.
   *
   * @param id - The ID of the user whose account status is to be updated.
   * @param updateAccountStatusDto - DTO containing the new account status.
   *
   * @returns A response object containing the updated user data (excluding the password).
   *
   * @throws HttpException with status 400 if the update fails.
   */
  @Patch(':id/account-status')
  @Roles(UserRole.ADMIN)
  async updateUserAccountStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountStatusDto: UpdateAccountStatusDto,
  ) {
    try {
      const updatedUser = await this.usersService.updateAccountStatus(
        id,
        updateAccountStatusDto.accountStatus,
      );

      const { password, ...safeUser } = updatedUser;

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'User account status updated successfully',
        data: safeUser,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update user account status',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
