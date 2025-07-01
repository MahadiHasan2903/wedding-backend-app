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
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enum/users.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { sanitizeError } from 'src/utils/helpers';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { SearchUserDto } from './dto/search-user.dto';

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
  async getProfile(@CurrentUser() user: { userId: number }) {
    try {
      const foundUser = await this.usersService.findUserById(user.userId);

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
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const foundUser = await this.usersService.findUserById(id);

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
  @Patch('profile')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'additionalPhotos', maxCount: 10 },
    ]),
  )
  async update(
    @CurrentUser() user: { userId: number },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      additionalPhotos?: Express.Multer.File[];
    },
  ) {
    const userId = user.userId;

    try {
      const user = await this.usersService.update(userId, updateUserDto, files);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update user',
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
    @CurrentUser() user: { userId: number },
    @Body() updateAccountStatusDto: UpdateAccountStatusDto,
  ) {
    try {
      // Call service method to update the account status of the current user
      const updatedUser = await this.usersService.updateAccountStatus(
        user.userId,
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
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Retrieves a paginated list of users, optionally filtered and sorted based on query parameters.
   *
   * Supports filtering by various user attributes, sorting, and pagination.
   * Access restricted to users with roles USER and ADMIN.
   *
   * @param {SearchUserDto} query - The query parameters including pagination, sorting, and filters.
   * @returns {Promise<PaginatedUsersResponse>} Paginated list of users with their profile pictures and additional photos populated.
   */
  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getAllUsers(@Query() query: SearchUserDto) {
    try {
      const {
        page,
        pageSize,
        sort,
        age,
        height,
        weight,
        joined,
        monthlyIncome,
        lookingFor,
        religion,
        politicalView,
        country,
        languageSpoken,
        education,
        profession,
        familyMember,
        maritalStatus,
        hasChildren,
        hasPet,
        dietaryPreference,
        smokingHabit,
        drinkingHabit,
      } = query;

      const data = await this.usersService.findUsersWithRelatedMediaPaginated(
        page,
        pageSize,
        sort,
        {
          age,
          height,
          weight,
          joined,
          monthlyIncome,
          lookingFor,
          religion,
          politicalView,
          country,
          languageSpoken,
          education,
          profession,
          familyMember,
          maritalStatus,
          hasChildren,
          hasPet,
          dietaryPreference,
          smokingHabit,
          drinkingHabit,
        },
      );

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to retrieve users',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
