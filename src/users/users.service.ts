import {
  UserRole,
  LikeStatus,
  BlockStatus,
  AccountStatus,
} from './enum/users.enum';
import { In, MoreThanOrEqual } from 'typeorm';
import { startOfDay, subDays, format } from 'date-fns';
import { UpdateUserDto } from './dto/update-user.dto';
import { MediaService } from 'src/media/media.service';
import { LikeDislikeDto } from './dto/like-dislike.dto';
import { BlockUnblockDto } from './dto/block-unblock.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { MediaRepository } from 'src/media/repositories/media.repository';
import { FiltersOptions, MonthlyRegistrationRaw } from './types/user.types';
import { MsPurchaseRepository } from 'src/ms-purchase/repositories/ms-purchase.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly usersRepository: UserRepository,
    private readonly mediaRepository: MediaRepository,
    private readonly msPurchaseRepository: MsPurchaseRepository,
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
   * Retrieves a paginated list of users filtered by a specific role.
   *
   * @param role - The user role to filter by (e.g., ADMIN, USER)
   * @param page - The page number to retrieve (default is 1)
   * @param pageSize - The number of users to retrieve per page (default is 10)
   * @returns An object containing paginated users along with pagination metadata
   */
  async findUsersByRolePaginated(role: UserRole, page = 1, pageSize = 10) {
    const [items, totalItems] = await this.usersRepository.findAndCount({
      where: { userRole: role },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const enrichedItems = await Promise.all(
      items.map((user) => this.usersRepository.enrichUserRelations(user)),
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: enrichedItems,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  /**
   * Retrieves a paginated list of users liked by a specific user.
   *
   * @param userId - The ID of the user whose liked users are being fetched
   * @param page - The page number to retrieve (default is 1)
   * @param pageSize - The number of users to retrieve per page (default is 10)
   * @throws NotFoundException if the user with the specified userId does not exist
   * @returns An object containing paginated liked users along with pagination metadata
   */
  async findLikedUsersPaginated(userId: string, page = 1, pageSize = 10) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const likedUserIds = user.likedUsers ?? [];

    if (likedUserIds.length === 0) {
      return {
        items: [],
        totalItems: 0,
        itemsPerPage: pageSize,
        currentPage: page,
        totalPages: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };
    }

    const totalItems = likedUserIds.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedIds = likedUserIds.slice(start, end);

    const likedUsers = await this.usersRepository.find({
      where: { id: In(paginatedIds) },
    });

    // Exclude password from user data before enrichment
    const safeUsers = likedUsers.map(({ password, ...rest }) => rest);

    const enrichedItems = await Promise.all(
      safeUsers.map((user) => this.usersRepository.enrichUserRelations(user)),
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: enrichedItems,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  /**
   * Updates the liked users list for a given user based on the provided action.
   *
   * @param userId - The ID of the user performing the like/dislike action
   * @param dto - Data transfer object containing the target user ID and the action status ('like' or 'dislike')
   * @returns The updated list of liked user IDs
   */
  async updateLikedUser(userId: string, dto: LikeDislikeDto) {
    const { likedUserId, status } = dto;

    // Fetch the user who is performing the like/dislike action
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (!user.likedUsers) {
      user.likedUsers = [];
    }

    if (status === LikeStatus.LIKE) {
      // If user is already liked, just return the existing list
      if (!user.likedUsers.includes(likedUserId)) {
        user.likedUsers.push(likedUserId);
      }
    } else if (status === LikeStatus.DISLIKE) {
      // Remove the likedUserId from the likedUsers array if present
      user.likedUsers = user.likedUsers.filter((id) => id !== likedUserId);
    }

    // Save the updated user entity
    await this.usersRepository.save(user);

    // Return the updated likedUsers list for confirmation
    return user.likedUsers;
  }

  /**
   * Checks whether a given user has liked a specific target user.
   *
   * @param userId - The ID of the user performing the like action.
   * @param targetUserId - The ID of the target user to check if liked.
   * @returns A boolean indicating whether the target user is in the user's liked users list.
   * @throws NotFoundException if the user with the specified `userId` does not exist.
   */
  async hasUserLikedTarget(
    userId: string,
    targetUserId: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['likedUsers'],
    });

    if (!user) {
      return false;
    }

    return user.likedUsers?.includes(targetUserId) ?? false;
  }

  /**
   * Retrieves a paginated list of users blocked by a specific user.
   *
   * @param userId - The ID of the user whose blocked users are being fetched
   * @param page - The page number to retrieve (default is 1)
   * @param pageSize - The number of users to retrieve per page (default is 10)
   * @param name - The name of the user
   * @throws NotFoundException if the user with the specified userId does not exist
   * @returns An object containing paginated blocked users along with pagination metadata
   */
  async findBlockedUsersPaginated(
    userId: string,
    page = 1,
    pageSize = 10,
    name?: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const blockedUserIds = user.blockedUsers ?? [];

    if (blockedUserIds.length === 0) {
      return {
        items: [],
        totalItems: 0,
        itemsPerPage: pageSize,
        currentPage: page,
        totalPages: 0,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };
    }

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...blockedUserIds)', { blockedUserIds });

    if (name) {
      queryBuilder.andWhere(
        `(LOWER(user.firstName) LIKE :name OR LOWER(user.lastName) LIKE :name)`,
        { name: `%${name.toLowerCase()}%` },
      );
    }

    const totalItems = await queryBuilder.getCount();

    const users = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const safeUsers = users.map(({ password, ...rest }) => rest);

    const enrichedItems = await Promise.all(
      safeUsers.map((user) => this.usersRepository.enrichUserRelations(user)),
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: enrichedItems,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
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

  /**
   * Checks whether a given user has blocked a specific target user.
   *
   * @param userId - The ID of the user performing the blocked action.
   * @param targetUserId - The ID of the target user to check if blocked.
   * @returns A boolean indicating whether the target user is in the user's blocked users list.
   * @throws NotFoundException if the user with the specified `userId` does not exist.
   */
  async hasUserBlockedTarget(
    userId: string,
    targetUserId: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['blockedUsers'],
    });

    if (!user) {
      return false;
    }

    return user.blockedUsers?.includes(targetUserId) ?? false;
  }

  /**
   * Removes an additional photo from a user's profile.
   *
   * @param userId - The ID of the user whose photo will be removed.
   * @param mediaId - The ID of the media/photo to remove.
   * @throws NotFoundException if the user or media ID is not found in user's photos.
   * @returns void
   */
  async removeAdditionalPhoto(userId: string, mediaId: string): Promise<void> {
    // Step 1: Find user
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Step 2: Validate that the media exists in user's additionalPhotos
    const currentPhotos = user.additionalPhotos || [];
    if (!currentPhotos.includes(mediaId)) {
      throw new NotFoundException(
        `Media ID ${mediaId} is not in user's additional photos`,
      );
    }

    // Step 3: Remove mediaId from user's additionalPhotos
    user.additionalPhotos = currentPhotos.filter((id) => id !== mediaId);
    await this.usersRepository.save(user);

    // Step 4: Delete the media from S3 and media table
    await this.mediaService.deleteMediaById(mediaId);
  }

  /**
   * Retrieves statistics about users, including counts of active, inactive, and VIP users.
   *
   * @returns An object containing:
   *   - activeCount: number of users with active accounts.
   *   - inactiveCount: number of users with inactive accounts.
   *   - vipCount: number of distinct users who purchased VIP packages (packageId 2 or 3).
   */
  async getUserStats() {
    // Run all counts in parallel for better performance
    const [activeCount, inactiveCount, vipCountResult] = await Promise.all([
      this.usersRepository.count({
        where: { accountStatus: AccountStatus.ACTIVE },
      }),
      this.usersRepository.count({
        where: { accountStatus: AccountStatus.INACTIVE },
      }),
      this.msPurchaseRepository
        .createQueryBuilder('purchase')
        .select('COUNT(DISTINCT purchase.user)', 'count')
        .where('purchase.packageId IN (:...packages)', { packages: [2, 3] })
        .getRawOne<{ count: string }>(),
    ]);

    const vipCount = parseInt(vipCountResult?.count ?? '0', 10);

    return {
      activeCount,
      inactiveCount,
      vipCount,
    };
  }

  /**
   * Retrieves new user registration statistics over multiple time ranges
   * and monthly grouped registration counts.
   *
   * @returns An object containing:
   *  - last24HoursCount: total registrations in the last 24 hours.
   *  - last7DaysCount: total registrations in the last 7 days.
   *  - last30DaysCount: total registrations in the last 30 days.
   *  - last90DaysCount: total registrations in the last 90 days.
   *  - monthlyRegistrations: array of objects with month name and new registration count for that month.
   */
  async getNewRegistrationStats() {
    const now = new Date();

    const last24Hours = startOfDay(subDays(now, 1));
    const last7Days = startOfDay(subDays(now, 7));
    const last30Days = startOfDay(subDays(now, 30));
    const last90Days = startOfDay(subDays(now, 90));

    // Run all counts and query in parallel for performance
    const [
      last24HoursCount,
      last7DaysCount,
      last30DaysCount,
      last90DaysCount,
      monthlyRegistrationsRaw,
    ] = await Promise.all([
      this.usersRepository.count({
        where: {
          createdAt: MoreThanOrEqual(last24Hours),
        },
      }),
      this.usersRepository.count({
        where: {
          createdAt: MoreThanOrEqual(last7Days),
        },
      }),
      this.usersRepository.count({
        where: {
          createdAt: MoreThanOrEqual(last30Days),
        },
      }),
      this.usersRepository.count({
        where: {
          createdAt: MoreThanOrEqual(last90Days),
        },
      }),
      this.usersRepository
        .createQueryBuilder('user')
        .select([
          `TO_CHAR(user.createdAt, 'YYYY-MM') as "yearMonth"`,
          'COUNT(*) as count',
        ])
        .groupBy(`"yearMonth"`)
        .orderBy(`"yearMonth"`, 'ASC')
        .getRawMany<MonthlyRegistrationRaw>(),
    ]);

    // Map raw monthly registration data into desired format
    const monthlyRegistrations = monthlyRegistrationsRaw.map(
      ({ yearMonth, count }) => {
        const [year, month] = yearMonth.split('-').map(Number);
        const formattedMonth = format(new Date(year, month - 1), 'MMMM yyyy');
        return {
          month: formattedMonth,
          newRegistration: parseInt(count, 10),
        };
      },
    );

    return {
      last24HoursCount,
      last7DaysCount,
      last30DaysCount,
      last90DaysCount,
      monthlyRegistrations,
    };
  }
}
