import {
  Controller,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { MsPurchaseService } from './ms-purchase.service';
import { sanitizeError } from 'src/utils/helpers';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateMsPurchaseDto } from './dto/create-ms-purchase.dto';

@Controller('v1/membership-purchases')
export class MsPurchaseController {
  constructor(private readonly msPurchaseService: MsPurchaseService) {}

  /**
   * Get all membership purchases made by the currently logged-in user.
   *
   * @param user - The current user extracted from the request context
   * @returns A list of the user's membership purchases
   * @access USER, ADMIN
   */
  @Get('my-purchases')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getMyPurchases(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('sort') sort = 'id,DESC',
    @CurrentUser() user: { userId: number },
  ) {
    try {
      const purchases = await this.msPurchaseService.findByUserId(user.userId, {
        page: Number(page),
        pageSize: Number(pageSize),
        sort,
      });

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Membership purchases fetched for the current user',
        data: purchases,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch membership purchases for current user',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Create a new membership purchase for the logged-in user.
   *
   * @param user - Current logged-in user from token
   * @param createDto - Payload containing msPackageId and packageType
   * @returns The created membership purchase record
   * @access USER, ADMIN
   */
  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async create(
    @CurrentUser() user: { userId: string },
    @Body() createDto: CreateMsPurchaseDto,
  ) {
    try {
      const purchase = await this.msPurchaseService.createPurchase(
        Number(user.userId),
        createDto.msPackageId,
        createDto.purchasePackageCategory,
      );

      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'Membership purchase created successfully',
        data: purchase,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to create membership purchase',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get a specific membership purchase by its ID.
   *
   * @param id - The ID of the membership purchase
   * @returns The matching membership purchase record
   * @access USER, ADMIN
   */
  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getOne(@Param('id') id: number) {
    try {
      const purchase = await this.msPurchaseService.findById(id);
      if (!purchase) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            success: false,
            message: 'Purchase not found',
            error: 'Invalid purchase ID',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Membership purchase fetched successfully',
        data: purchase,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch membership purchase',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get all membership purchases in the system.
   *
   * @returns A list of all membership purchases
   * @access ADMIN
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async getAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('sort') sort = 'id,DESC',
  ) {
    try {
      const purchases = await this.msPurchaseService.findAll({
        page: Number(page),
        pageSize: Number(pageSize),
        sort,
      });

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Membership purchases fetched successfully',
        data: purchases,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to fetch membership purchases',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Delete a membership purchase by its ID.
   *
   * @param id - The ID of the purchase to delete
   * @returns A confirmation message upon successful deletion
   * @access ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    try {
      const deleted = await this.msPurchaseService.delete(id);
      if (!deleted) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            success: false,
            message: 'Purchase not found',
            error: 'Invalid purchase ID',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Purchase deleted successfully',
        data: {},
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to delete purchase',
          error: sanitizeError(error),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
