import {
  Controller,
  Patch,
  Param,
  Body,
  UseInterceptors,
  HttpStatus,
  HttpException,
  UploadedFiles,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BlockStatus, LikeStatus, UserRole } from './enum/users.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { sanitizeError } from 'src/utils/helpers';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dts';
import { BlockUnblockDto } from './dto/block-unblock.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LikeDislikeDto } from './dto/like-dislike.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves a paginated list of all users with the ADMIN role.
   *
   * @route GET /admins
   * @access Admin only
   * @param page - The current page number (default: 1)
   * @param pageSize - The number of users per page (default: 10)
   * @returns A paginated list of admin users with status and message
   */
  @Get('admins')
  @Roles(UserRole.ADMIN)
  async getAllAdmins(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    try {
      const result = await this.usersService.findUsersByRolePaginated(
        UserRole.ADMIN,
        Number(page),
        Number(pageSize),
      );

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Admin users fetched successfully',
        data: result,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch admin users',
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
  @Public()
  @Get()
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
        city,
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
          city,
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

  /**
   * Get the logged-in user's profile using ID from token.
   *
   * @param user - Injected user from token.
   * @returns The user's profile excluding sensitive info.
   */
  @Get('profile')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getProfile(@CurrentUser() user: { userId: string }) {
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
   * Updates a user's profile, including uploading a new profile picture if provided.
   *
   * @param id - The user's unique ID from the route parameter.
   * @param updateUserDto - DTO containing fields to update on the user.
   * @param file - Optional uploaded profile image file (from multipart/form-data).
   * @returns A response object with status, success flag, message, and updated user data (excluding password).
   *
   * @throws HttpException - If an error occurs during the update, a 400 Bad Request is thrown with error details.
   */
  @Patch('update-profile')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'additionalPhotos', maxCount: 20 },
    ]),
  )
  async update(
    @CurrentUser() user: { userId: string },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    rawFiles: {
      profilePicture?: Express.Multer.File[];
      additionalPhotos?: Express.Multer.File[];
    },
  ) {
    //  Normalize file input
    const files = {
      profilePicture: rawFiles.profilePicture?.[0],
      additionalPhotos: rawFiles.additionalPhotos || [],
    };

    try {
      const updatedUser = await this.usersService.update(
        user.userId,
        updateUserDto,
        files,
      );

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
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
    @CurrentUser() user: { userId: string },
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
   * Updates the role of a user (e.g., USER → ADMIN) by user ID.
   * This endpoint is restricted to admin users only.
   * It expects a request body containing the user's ID and the new role.
   * @param updateUserRoleDto - DTO containing the user's ID and the new role (must be a valid `UserRole` enum).
   * @returns A response object containing the updated user data (excluding the password).
   * @throws HttpException - Returns a 400 Bad Request with an error message if the update fails.
   */
  @Patch('update-role')
  @Roles(UserRole.ADMIN)
  async updateUserRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    try {
      const updatedUser = await this.usersService.updateUserRole(
        updateUserRoleDto.userId,
        updateUserRoleDto.userRole,
      );

      const { password, ...safeUser } = updatedUser;

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: safeUser,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update user role',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Retrieves a paginated list of users liked by the current user.
   *
   * @route GET /liked-users
   * @access User and Admin
   * @param user - The currently authenticated user (from @CurrentUser decorator)
   * @param page - The current page number (default: 1)
   * @param pageSize - The number of users per page (default: 10)
   * @returns A paginated list of liked users with status and message
   */
  @Get('liked-users')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getLikedUsers(
    @CurrentUser() user: { userId: string },
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    try {
      const result = await this.usersService.findLikedUsersPaginated(
        user.userId,
        Number(page),
        Number(pageSize),
      );

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Liked users retrieved successfully',
        data: result,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch liked users',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Handles liking or disliking a user based on the provided DTO.
   *
   * @param user - The currently authenticated user performing the action
   * @param dto - Data transfer object containing the ID of the target user and the like/dislike status
   * @returns An object containing the updated list of liked users and operation status
   */
  @Patch('like')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateLikedUser(
    @CurrentUser() user: { userId: string },
    @Body() dto: LikeDislikeDto,
  ) {
    try {
      const updatedLikedUsers = await this.usersService.updateLikedUser(
        user.userId,
        dto,
      );

      return {
        status: HttpStatus.OK,
        success: true,
        message:
          dto.status === LikeStatus.LIKE
            ? 'User liked successfully'
            : 'User disliked successfully',
        data: updatedLikedUsers,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update liked users',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Retrieves a paginated list of users blocked by the current user.
   *
   * @route GET /blocked-users
   * @access User and Admin
   * @param user - The currently authenticated user (from @CurrentUser decorator)
   * @param page - The current page number (default: 1)
   * @param pageSize - The number of users per page (default: 10)
   * @returns A paginated list of blocked users with status and message
   */
  @Get('blocked-users')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getBlockedUsers(
    @CurrentUser() user: { userId: string },
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    try {
      const result = await this.usersService.findBlockedUsersPaginated(
        user.userId,
        Number(page),
        Number(pageSize),
      );

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Blocked users retrieved successfully',
        data: result,
      };
    } catch (error) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch blocked users',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Handles blocking or unblocking a user based on the provided DTO.
   *
   * @param user - The currently authenticated user performing the action (extracted from the request).
   * @param dto - Data transfer object containing the ID of the user to block/unblock and the action status.
   * @returns An object containing the updated list of blocked users and operation status.
   */
  @Patch('block')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateBlockedUser(
    @CurrentUser() user: { userId: string },
    @Body() dto: BlockUnblockDto,
  ) {
    try {
      const updatedBlockedUsers = await this.usersService.updateBlockedUser(
        user.userId,
        dto,
      );

      // Return a successful response with a message depending on the block/unblock action
      return {
        status: HttpStatus.OK,
        success: true,
        message:
          dto.status === BlockStatus.BLOCK
            ? 'User blocked successfully'
            : 'User unblocked successfully',
        data: updatedBlockedUsers,
      };
    } catch (error) {
      // Sanitize the error before sending it in the response for security reasons
      const sanitizedError = sanitizeError(error);

      // Throw an HttpException with a 400 Bad Request status and error details
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to update blocked users',
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
  async getUserById(@Param('id') id: string) {
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
   * Admin-only endpoint to update account status of any user by user ID.
   *
   * @param id - The ID of the user whose account status is to be updated.
   * @param updateAccountStatusDto - DTO containing the new account status.
   * @returns A response object containing the updated user data (excluding the password).
   * @throws HttpException with status 400 if the update fails.
   */
  @Patch(':id/account-status')
  @Roles(UserRole.ADMIN)
  async updateUserAccountStatus(
    @Param('id') id: string,
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
   * Deletes an additional photo from the user's profile.
   *
   * @param user - The current authenticated user (injected via custom decorator)
   * @param photoId - The ID of the photo to be deleted
   * @returns Success message with status
   */
  @Delete('photo/:photoId')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async deleteAdditionalPhoto(
    @CurrentUser() user: { userId: string },
    @Param('photoId') photoId: string,
  ) {
    try {
      await this.usersService.removeAdditionalPhoto(user.userId, photoId);

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Photo deleted successfully',
        data: {},
      };
    } catch (error) {
      // Let known HTTP exceptions bubble up directly
      if (error instanceof HttpException) {
        throw error;
      }

      // Log or sanitize the unknown error if needed
      const sanitizedError = sanitizeError(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to delete photo',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
