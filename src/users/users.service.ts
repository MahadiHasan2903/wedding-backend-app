import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  AccountStatus,
  DietaryPreference,
  DrinkingHabit,
  Gender,
  MaritalStatus,
  PoliticalView,
  Religion,
  SmokingHabit,
} from './enum/users.enum';
import { subYears } from 'date-fns';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/entities/media.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    private readonly mediaService: MediaService,
  ) {}

  /**
   * Retrieves a user by their ID, excluding the password field from the returned object.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A user object without the password field.
   *
   * @throws NotFoundException - If no user exists with the provided ID.
   */
  async findById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Fetches a paginated list of users with sorting and advanced filtering options.
   *
   * @param page - Current page number (default: 1)
   * @param pageSize - Number of items per page (default: 10)
   * @param sort - Sort order string in the format 'field,ASC|DESC' (default: 'id,DESC')
   * @param filters - Object containing filter values for fields like age, height, religion, etc.
   * @returns An object containing paginated user data (excluding passwords)
   */
  async findAllPaginated(
    page = 1,
    pageSize = 10,
    sort = 'id,DESC',
    filters: {
      age?: string;
      height?: string;
      weight?: string;
      monthlyIncome?: string;
      lookingFor?: string;
      religion?: string;
      country?: string;
      education?: string;
      profession?: string;
      familyMember?: string;
      languageSpoken?: string;
      politicalView?: string;
      maritalStatus?: string;
      hasChildren?: string;
      hasPet?: boolean;
      dietaryPreference?: string;
      smokingHabit?: string;
      drinkingHabit?: string;
    } = {},
  ): Promise<{
    items: Omit<User, 'password'>[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [sortField, sortOrder] = sort.split(',');

    const qb = this.usersRepository.createQueryBuilder('user');

    // --------------------------
    // RANGE FILTERS
    // --------------------------

    if (filters.age?.includes('-')) {
      const [minAge, maxAge] = filters.age.split('-').map(Number);
      if (!isNaN(minAge) && !isNaN(maxAge)) {
        const maxDob = subYears(new Date(), minAge);
        const minDob = subYears(new Date(), maxAge);
        qb.andWhere('user.dateOfBirth BETWEEN :minDob AND :maxDob', {
          minDob,
          maxDob,
        });
      }
    }

    if (filters.height?.includes('-')) {
      const [min, max] = filters.height.split('-').map(Number);
      qb.andWhere('user.heightCm BETWEEN :min AND :max', { min, max });
    }

    if (filters.weight?.includes('-')) {
      const [min, max] = filters.weight.split('-').map(Number);
      qb.andWhere('user.weightKg BETWEEN :min AND :max', { min, max });
    }

    if (filters.familyMember?.includes('-')) {
      const [min, max] = filters.familyMember.split('-').map(Number);
      qb.andWhere('user.familyMemberCount BETWEEN :min AND :max', { min, max });
    }

    if (filters.monthlyIncome?.includes('-')) {
      const [min, max] = filters.monthlyIncome.split('-').map(Number);
      qb.andWhere('user.monthlyIncome BETWEEN :min AND :max', { min, max });
    }

    // --------------------------
    // ENUM / EXACT MATCH FILTERS
    // --------------------------

    if (
      filters.lookingFor &&
      Object.values(Gender).includes(filters.lookingFor as Gender)
    ) {
      qb.andWhere('user.gender = :gender', { gender: filters.lookingFor });
    }

    if (
      filters.religion &&
      Object.values(Religion).includes(filters.religion as Religion)
    ) {
      qb.andWhere('user.religion = :religion', { religion: filters.religion });
    }

    if (
      filters.politicalView &&
      Object.values(PoliticalView).includes(
        filters.politicalView as PoliticalView,
      )
    ) {
      qb.andWhere('user.politicalView = :politicalView', {
        politicalView: filters.politicalView,
      });
    }

    if (
      filters.maritalStatus &&
      Object.values(MaritalStatus).includes(
        filters.maritalStatus as MaritalStatus,
      )
    ) {
      qb.andWhere('user.maritalStatus = :maritalStatus', {
        maritalStatus: filters.maritalStatus,
      });
    }

    if (
      filters.dietaryPreference &&
      Object.values(DietaryPreference).includes(
        filters.dietaryPreference as DietaryPreference,
      )
    ) {
      qb.andWhere('user.dietaryPreference = :dietaryPreference', {
        dietaryPreference: filters.dietaryPreference,
      });
    }

    if (
      filters.smokingHabit &&
      Object.values(SmokingHabit).includes(filters.smokingHabit as SmokingHabit)
    ) {
      qb.andWhere('user.smokingHabit = :smokingHabit', {
        smokingHabit: filters.smokingHabit,
      });
    }

    if (
      filters.drinkingHabit &&
      Object.values(DrinkingHabit).includes(
        filters.drinkingHabit as DrinkingHabit,
      )
    ) {
      qb.andWhere('user.drinkingHabit = :drinkingHabit', {
        drinkingHabit: filters.drinkingHabit,
      });
    }

    // --------------------------
    // SIMPLE STRING FILTERS
    // --------------------------

    if (filters.country) {
      qb.andWhere('user.country = :country', { country: filters.country });
    }

    if (filters.languageSpoken) {
      qb.andWhere('user.motherTongue = :languageSpoken', {
        languageSpoken: filters.languageSpoken,
      });
    }

    // --------------------------
    // PARTIAL MATCH FILTERS (LIKE)
    // --------------------------

    if (filters.education) {
      qb.andWhere('user.highestEducation LIKE :education', {
        education: `%${filters.education}%`,
      });
    }

    if (filters.profession) {
      qb.andWhere('user.profession LIKE :profession', {
        profession: `%${filters.profession}%`,
      });
    }

    // --------------------------
    // BOOLEAN-LIKE FILTERS
    // --------------------------

    if (filters.hasChildren !== undefined) {
      const hasChildren = filters.hasChildren === 'true';
      if (hasChildren) {
        qb.andWhere('user.children > 0');
      } else {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('user.children = 0').orWhere('user.children IS NULL');
          }),
        );
      }
    }

    if (filters.hasPet !== undefined) {
      if (filters.hasPet) {
        qb.andWhere('user.hasPet = true');
      } else {
        qb.andWhere(
          new Brackets((qb) => {
            qb.where('user.hasPet = false').orWhere('user.hasPet IS NULL');
          }),
        );
      }
    }

    // --------------------------
    // SORTING
    // --------------------------
    qb.orderBy(
      `user.${sortField}`,
      sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    // --------------------------
    // PAGINATION
    // --------------------------
    qb.skip((page - 1) * pageSize).take(pageSize);

    // Execute query and get result with total count
    const [items, totalItems] = await qb.getManyAndCount();

    const safeItems = items.map(({ password, ...rest }) => rest);
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      items: safeItems,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
    };
  }

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
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profilePicture', 'additionalPhotos'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // ✅ Remove old profile picture (if any)
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

    // ✅ Upload new additional photos (append instead of overwrite)
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

    // ✅ Profile picture update via ID
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

    // ✅ Additional photos update via ID
    if (updateUserDto.additionalPhotos?.length) {
      const photos = await this.mediaRepository.findByIds(
        updateUserDto.additionalPhotos,
      );
      user.additionalPhotos = photos;
    }

    // ✅ Merge remaining data
    const { profilePicture, additionalPhotos, ...rest } = updateUserDto;
    this.usersRepository.merge(user, rest);

    return this.usersRepository.save(user);
  }

  /**
   * Updates the account status of a user by their ID.
   *
   * @param userId - The unique identifier of the user whose account status is to be updated.
   * @param accountStatus - The new account status to set for the user.
   * @returns The updated User entity after saving the new account status.
   *
   * @throws NotFoundException - Throws if no user exists with the provided userId.
   */
  async updateAccountStatus(
    userId: number,
    accountStatus: AccountStatus,
  ): Promise<User> {
    // Find the user entity by its ID from the database
    const user = await this.usersRepository.findOneBy({ id: userId });

    // If user does not exist, throw a 404 Not Found error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the accountStatus property of the user entity
    user.accountStatus = accountStatus;

    // Save the updated user entity back to the database and return it
    return this.usersRepository.save(user);
  }
}
