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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enum/users.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { sanitizeError } from 'src/utils/helpers';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
