// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileService } from 'src/common/file/file.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly fileService: FileService,
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
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (file) {
      if (user.profilePicture) {
        await this.fileService.deleteFile(user.profilePicture);
      }

      const uploadedImageUrl = await this.fileService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        `users/${user.id}`,
      );

      updateUserDto.profilePicture = uploadedImageUrl;
    }

    const updatedUser = this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(updatedUser);
  }
}
