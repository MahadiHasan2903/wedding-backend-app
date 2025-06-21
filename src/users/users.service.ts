import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { MediaService } from 'src/common/media/media.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Updates a user's information, including profile fields and optional profile picture upload.
   *
   * @param id - The unique ID of the user to update.
   * @param updateUserDto - DTO containing the fields to be updated (e.g., name, email, etc.).
   * @param file - Optional uploaded file (profile picture) from multipart/form-data.
   *
   * If a file is provided, the previous profile picture (if any) will be deleted and replaced
   * with the new uploaded image. The file is stored under `users/{user.id}/` in the storage service.
   *
   * @returns The updated User entity after saving changes to the database.
   *
   * @throws NotFoundException - If no user with the specified ID exists.
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    files?: {
      profilePicture?: Express.Multer.File[];
      additionalPhotos?: Express.Multer.File[];
    },
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Handle profile picture
    if (files?.profilePicture?.length) {
      const file = files.profilePicture[0];
      const uploadedUrl = await this.mediaService.uploadMedia(
        file.buffer,
        file.originalname,
        file.mimetype,
        `users/${id}/profile`,
      );

      // Delete old one if different
      if (user.profilePicture && user.profilePicture !== uploadedUrl) {
        await this.mediaService.deleteMedia(user.profilePicture);
      }

      updateUserDto.profilePicture = uploadedUrl;
    }

    // Handle additional photos
    if (files?.additionalPhotos?.length) {
      const uploadedUrls: string[] = [];
      for (const file of files.additionalPhotos) {
        const url = await this.mediaService.uploadMedia(
          file.buffer,
          file.originalname,
          file.mimetype,
          `users/${id}/additional-photo-album`,
        );
        uploadedUrls.push(url);
      }
      updateUserDto.additionalPhotos = uploadedUrls;
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }
}
