import { DataSource, Repository, Brackets } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { subYears } from 'date-fns';
import {
  DietaryPreference,
  DrinkingHabit,
  Gender,
  MaritalStatus,
  PoliticalView,
  Religion,
  SmokingHabit,
} from '../enum/users.enum';
import { FiltersType } from 'src/types/filter.types';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Retrieves a user by their ID while excluding the password field from the result.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A Promise resolving to the user object without the password field, or `null` if no user is found.
   */

  async findByIdWithoutPassword(
    id: number,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.findOneBy({ id });
    if (!user) {
      return null;
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Retrieves a paginated list of users based on filters, sorting, and pagination parameters.
   *
   * @param page - The current page number (default is 1).
   * @param pageSize - The number of users to return per page (default is 10).
   * @param sort - Sorting string in the format 'field,ASC|DESC' (default is 'id,DESC').
   * @param filters - An object containing filtering criteria such as age range, gender, religion, etc.
   *
   * @returns A Promise resolving to a paginated response object containing:
   */
  async findAllPaginated(
    page = 1,
    pageSize = 10,
    sort = 'id,DESC',
    filters: FiltersType = {},
  ): Promise<{
    items: Omit<User, 'password'>[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [sortField, sortOrder] = sort.split(',');

    const qb = this.createQueryBuilder('user');

    // RANGE FILTERS
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

    // ENUM / EXACT MATCH FILTERS
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

    // SIMPLE STRING FILTERS
    if (filters.country) {
      qb.andWhere('user.country = :country', { country: filters.country });
    }

    if (filters.languageSpoken) {
      qb.andWhere('user.motherTongue = :languageSpoken', {
        languageSpoken: filters.languageSpoken,
      });
    }

    // PARTIAL MATCH FILTERS (LIKE)
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

    // BOOLEAN-LIKE FILTERS
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

    // SORTING
    qb.orderBy(
      `user.${sortField}`,
      sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    // PAGINATION
    qb.skip((page - 1) * pageSize).take(pageSize);

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
}
