import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { MediaService } from 'src/media/media.service';
import { AccountStatus, BlockStatus, UserRole } from './enum/users.enum';
import { In } from 'typeorm';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { FiltersOptions } from './types/user.types';
import { BlockUnblockDto } from './dto/block-unblock.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly mediaRepository: MediaRepository,
    private readonly mediaService: MediaService,
  ) {}

  /**
   * Retrieves a user by their ID while excluding the password field.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A Promise resolving to the user object without the password field.
   * @throws NotFoundException - Thrown if no user exists with the provided ID.
   */
  async findUserById(id: string) {
    const user = await this.usersRepository.findByIdWithoutPassword(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersRepository.enrichUserRelations(user);
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
  async findUsersWithRelatedMediaPaginated(
    page = 1,
    pageSize = 10,
    sort = 'id,DESC',
    filters: FiltersOptions = {},
  ) {
    const {
      items,
      totalItems,
      itemsPerPage,
      currentPage,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = await this.usersRepository.findAllPaginated(
      page,
      pageSize,
      sort,
      filters,
    );

    const enrichedItems = await Promise.all(
      items.map((user) => this.usersRepository.enrichUserRelations(user)),
    );

    return {
      items: enrichedItems,
      totalItems,
      itemsPerPage,
      currentPage,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }

  /**
   * Updates user information including optional profile picture and additional photos.
   *
   * - If `files.profilePicture` is provided, it uploads and replaces the existing profile picture.
   * - If `files.additionalPhotos` are provided, it uploads and appends them to existing ones.
   * - If `updateUserDto.profilePicture` is provided (as ID), it directly sets the profile picture.
   * - If `updateUserDto.additionalPhotos` is provided (array of IDs), it sets them directly.
   *
   * @param id - User ID
   * @param updateUserDto - Fields to update in the user
   * @param files - Uploaded files for profile picture and additional photos
   * @returns The updated user entity
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    files?: {
      profilePicture?: Express.Multer.File;
      additionalPhotos?: Express.Multer.File[];
    },
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // === Upload new profile picture ===
    if (files?.profilePicture) {
      if (user.profilePicture) {
        await this.mediaService.deleteMediaById(user.profilePicture);
      }

      const media = await this.mediaService.handleUpload(
        files.profilePicture,
        `user_profile`,
        `users/${id}/user-profile`,
      );

      user.profilePicture = media.id;
    } else if (updateUserDto.profilePicture) {
      user.profilePicture = updateUserDto.profilePicture;
    }

    // === Upload new additional photos ===
    if (files?.additionalPhotos?.length) {
      const mediaList = await Promise.all(
        files.additionalPhotos.map((file) =>
          this.mediaService.handleUpload(
            file,
            `user_gallery`,
            `users/${id}/user-gallery`,
          ),
        ),
      );

      const uploadedIds = mediaList.map((media) => media.id);
      const existingIds = user.additionalPhotos || [];
      user.additionalPhotos = Array.from(
        new Set([...existingIds, ...uploadedIds]),
      );
    } else if (updateUserDto.additionalPhotos?.length) {
      const photos = await this.mediaRepository.find({
        where: {
          id: In(updateUserDto.additionalPhotos),
        },
      });

      if (photos.length !== updateUserDto.additionalPhotos.length) {
        throw new NotFoundException(
          'One or more additional photo IDs are invalid',
        );
      }

      user.additionalPhotos = updateUserDto.additionalPhotos;
    }

    // === Merge other update fields ===
    const { profilePicture, additionalPhotos, ...rest } = updateUserDto;
    this.usersRepository.merge(user, rest);

    const savedUser = await this.usersRepository.save(user);

    const safeUser = (({ password, ...rest }) => rest)(savedUser);
    return this.usersRepository.enrichUserRelations(safeUser);
  }

  /**
   * Updates the account status of a user by their unique identifier.
   *
   * @param userId - The ID of the user whose account status should be updated.
   * @param accountStatus - The new account status to assign (e.g., ACTIVE, SUSPENDED).
   * @returns A Promise resolving to the updated User entity.
   * @throws NotFoundException - Thrown if no user is found with the given ID.
   */

  async updateAccountStatus(userId: string, accountStatus: AccountStatus) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.accountStatus = accountStatus;
    return this.usersRepository.save(user);
  }

  /**
   * Updates the role of a specific user.
   *
   * @param userId - The ID of the user whose role is to be updated.
   * @param userRole - The new role to assign to the user (must be a valid `UserRole` enum).
   * @returns The updated user entity after the role change.
   * @throws NotFoundException - If no user is found with the given ID.
   */
  async updateUserRole(userId: string, userRole: UserRole) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    user.userRole = userRole;
    return this.usersRepository.save(user);
  }

  /**
   * Retrieves all users with the specified role and enriches them with related data.
   *
   * @param userRole - The role to filter users by (e.g., ADMIN, CUSTOMER, etc.)
   * @returns A promise that resolves to an array of enriched user entities.
   */
  async findUsersByRole(userRole: UserRole) {
    const users = await this.usersRepository.find({
      where: { userRole },
    });

    const enrichedUsers = await Promise.all(
      users.map((user) => this.usersRepository.enrichUserRelations(user)),
    );

    return enrichedUsers;
  }

  /**
   * Retrieves the list of users blocked by the specified user.
   *
   * @param userId - The ID of the user whose blocked users we want to find.
   * @returns An array of user objects representing the blocked users, with sensitive data removed and relations enriched.
   */
  async findBlockedUsers(userId: string) {
    // Fetch the user entity by ID, including the blockedUsers array (list of blocked user IDs)
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    // Throw an error if the user with the given ID does not exist
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // If the user has no blocked users, return an empty array early
    if (!user.blockedUsers || user.blockedUsers.length === 0) {
      return [];
    }

    // Fetch full user entities for each blocked user ID
    // Note: Excluding password in the next step for security reasons
    const blockedUsers = await this.usersRepository.find({
      where: {
        id: In(user.blockedUsers),
      },
    });

    // Remove sensitive fields such as password from each blocked user object
    const safeBlockedUsers = blockedUsers.map(({ password, ...rest }) => rest);

    const enrichedBlockedUsers = await Promise.all(
      safeBlockedUsers.map((blockedUser) =>
        this.usersRepository.enrichUserRelations(blockedUser),
      ),
    );

    // Return the fully enriched blocked user objects
    return enrichedBlockedUsers;
  }

  /**
   * Updates the blocked users list for a given user based on the provided action.
   *
   * @param userId - The ID of the user performing the block/unblock action.
   * @param dto - Data transfer object containing the target user ID and the action status ('block' or 'unblock').
   * @returns The updated list of blocked user IDs.
   */
  async updateBlockedUser(userId: string, dto: BlockUnblockDto) {
    const { blockedUserId, status } = dto;

    // Fetch the user who is performing the block/unblock action
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (!user.blockedUsers) {
      user.blockedUsers = [];
    }

    if (status === BlockStatus.BLOCK) {
      // If user is already blocked, just return the existing list
      if (user.blockedUsers.includes(blockedUserId)) {
        return user.blockedUsers;
      }

      // Add the blockedUserId to the blockedUsers array
      user.blockedUsers.push(blockedUserId);
    } else if (status === BlockStatus.UNBLOCK) {
      // Remove the blockedUserId from the blockedUsers array if present
      user.blockedUsers = user.blockedUsers.filter(
        (id) => id !== blockedUserId,
      );
    }

    // Save the updated user entity
    await this.usersRepository.save(user);

    // Return the updated blockedUsers list for confirmation
    return user.blockedUsers;
  }
}
