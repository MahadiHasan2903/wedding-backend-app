import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { sanitizeError } from 'src/utils/helpers';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';

@Controller('v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Get all media items.
   *
   * @returns List of all media records.
   */
  @Public()
  @Get()
  async getAll() {
    try {
      const media = await this.mediaService.getAll();
      return {
        success: true,
        message: 'Media list fetched successfully',
        status: HttpStatus.OK,
        data: media,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      // Let known HTTP exceptions bubble up
      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'An unexpected error occurred while retrieving media list',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a single media item by ID.
   *
   * @param id - ID of the media to retrieve.
   * @returns Media record matching the ID.
   */
  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const media = await this.mediaService.getOne(+id);
      return {
        success: true,
        message: 'Media fetched successfully',
        status: HttpStatus.OK,
        data: media,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `An unexpected error occurred while retrieving media with ID ${id}`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a media item by ID.
   *
   * @param id - ID of the media to delete.
   * @returns Deletion confirmation message.
   */
  @Delete(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    try {
      await this.mediaService.delete(+id);
      return {
        success: true,
        message: 'Media deleted successfully',
        status: HttpStatus.OK,
        data: {},
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: `An unexpected error occurred while deleting media with ID ${id}`,
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Upload a media file to S3 and save its metadata.
   *
   * @param file - File object uploaded via multipart/form-data.
   * @returns Uploaded media metadata.
   */
  @Post('upload')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        {
          success: false,
          message: 'File is required',
          status: HttpStatus.BAD_REQUEST,
          error:
            'No files were uploaded. Please attach the required file(s) before submitting.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const media = await this.mediaService.handleUpload(
        file,
        'general-collections',
        'general-folder',
      );

      return {
        success: true,
        message: 'File uploaded successfully',
        status: HttpStatus.CREATED,
        data: media,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      if (error instanceof HttpException) throw error;

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'An unexpected error occurred while uploading the media',
          data: {},
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
