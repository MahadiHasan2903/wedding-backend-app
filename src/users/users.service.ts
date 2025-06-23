import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AccountStatus } from './enum/users.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    private readonly mediaService: MediaService,
  ) {}

  /**
   * Retrieves a user by their ID while excluding the password field.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A Promise resolving to the user object without the password field.
   * @throws NotFoundException - Thrown if no user exists with the provided ID.
   */
  async findById(id: number) {
    const user = await this.usersRepository.findByIdWithoutPassword(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Fetches a paginated list of users with optional sorting and advanced filtering.
   *
   * @param page - The current page number (default is 1).
   * @param pageSize - The number of users to return per page (default is 10).
   * @param sort - A string in the format 'field,ASC|DESC' used to sort results (default is 'id,DESC').
   * @param filters - An object containing various filters such as age range, gender, religion, etc.
   * @returns A Promise resolving to an object containing:
   *
   */
  async findAllPaginated(
    page = 1,
    pageSize = 10,
    sort = 'id,DESC',
    filters = {},
  ) {
    return this.usersRepository.findAllPaginated(page, pageSize, sort, filters);
  }

  /**
   * Updates a user's profile information, including optional profile picture and additional photo uploads.
   *
   * @param id - The unique identifier of the user to update.
   * @param updateUserDto - Data Transfer Object containing the fields to update (e.g., name, email, profilePicture ID).
   * @param files - Optional uploaded files, including a profile picture and/or additional photos.
   * @returns A Promise resolving to the updated User entity.
   * @throws NotFoundException - Thrown if the user with the specified ID does not exist or if a referenced media ID is invalid.
   */

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    files?: {
      profilePicture?: Express.Multer.File[];
      additionalPhotos?: Express.Multer.File[];
    },
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profilePicture', 'additionalPhotos'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Remove old profile picture (if any)
    if (files?.profilePicture?.[0]) {
      if (user.profilePicture) {
        const oldProfilePictureId = user.profilePicture.id;
        user.profilePicture = null;
        await this.usersRepository.save(user);

        await this.mediaService.deleteMediaById(oldProfilePictureId);
      }

      // Upload new profile picture
      const media = await this.mediaService.handleUpload(
        files.profilePicture[0],
        `users/${id}/user-profile`,
        `users/${id}/user-profile`,
      );
      user.profilePicture = media;
    }

    // Upload new additional photos (append instead of overwrite)
    if (files?.additionalPhotos?.length) {
      const mediaList = await Promise.all(
        files.additionalPhotos.map((file) =>
          this.mediaService.handleUpload(
            file,
            `users/${id}/user-gallery`,
            `users/${id}/user-gallery`,
          ),
        ),
      );
      user.additionalPhotos = [...(user.additionalPhotos || []), ...mediaList];
    }

    // Profile picture update via ID
    if (updateUserDto.profilePicture) {
      const media = await this.mediaRepository.findOneBy({
        id: updateUserDto.profilePicture,
      });
      if (!media) {
        throw new NotFoundException('Invalid profile picture ID');
      }

      if (user.profilePicture && user.profilePicture.id !== media.id) {
        const oldProfilePictureId = user.profilePicture.id;
        user.profilePicture = null;
        await this.usersRepository.save(user);

        await this.mediaService.deleteMediaById(oldProfilePictureId);
      }

      user.profilePicture = media;
    }

    // Additional photos update via ID
    if (updateUserDto.additionalPhotos?.length) {
      const photos = await this.mediaRepository.find({
        where: {
          id: In(updateUserDto.additionalPhotos),
        },
      });
      user.additionalPhotos = photos;
    }

    // Merge remaining data
    const { profilePicture, additionalPhotos, ...rest } = updateUserDto;
    this.usersRepository.merge(user, rest);

    return this.usersRepository.save(user);
  }

  /**
   * Updates the account status of a user by their unique identifier.
   *
   * @param userId - The ID of the user whose account status should be updated.
   * @param accountStatus - The new account status to assign (e.g., ACTIVE, SUSPENDED).
   * @returns A Promise resolving to the updated User entity.
   * @throws NotFoundException - Thrown if no user is found with the given ID.
   */

  async updateAccountStatus(userId: number, accountStatus: AccountStatus) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.accountStatus = accountStatus;
    return this.usersRepository.save(user);
  }
}
