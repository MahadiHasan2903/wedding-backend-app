import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateMsPackageDto } from './dto/create-ms-package.dto';
import { UpdateMsPackageDto } from './dto/update-ms-package.dto';
import { sanitizeError } from 'src/utils/helpers';
import { MsPackageService } from './msPackage.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enum/users.enum';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('v1/membership-package')
export class MsPackageController {
  constructor(private readonly msPackageService: MsPackageService) {}

  /**
   * Retrieve all service packages.
   * Public endpoint accessible to USER and ADMIN roles.
   * Returns a list of all available packages.
   */
  @Public()
  @Get()
  async getAll() {
    try {
      const allMsPackages = await this.msPackageService.findAll();
      return {
        status: HttpStatus.OK,
        success: true,
        message: 'Packages retrieved successfully',
        data: allMsPackages,
      };
    } catch (error: unknown) {
      // Handle and sanitize error before returning
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Failed to retrieve packages',
          error: sanitizedError,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve a single package by its ID.
   * Public endpoint accessible to USER and ADMIN roles.
   * @param id - Package ID (path parameter)
   * @returns The package details if found.
   */
  @Public()
  @Get(':id')
  async getOneById(@Param('id') id: string) {
    try {
      const packageDetails = await this.msPackageService.findOne(+id);
      return {
        status: HttpStatus.OK,
        success: true,
        message: `Package retrieved successfully`,
        data: packageDetails,
      };
    } catch (error: unknown) {
      // Handle and sanitize error before returning
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          success: false,
          message: `Failed to retrieve package with id ${id}`,
          error: sanitizedError,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Create a new service package.
   * Restricted to ADMIN role.
   * @param createMsPackageDto - DTO containing package creation data
   * @returns The created package.
   */
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createMsPackageDto: CreateMsPackageDto) {
    try {
      const data = await this.msPackageService.create(createMsPackageDto);
      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'Package created successfully',
        data,
      };
    } catch (error: unknown) {
      // Handle and sanitize error before returning
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Failed to create package',
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Update an existing service package by ID.
   * Restricted to ADMIN role.
   * @param id - Package ID (path parameter)
   * @param updateMsPackageDto - DTO containing update data
   * @returns The updated package.
   */
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMsPackageDto: UpdateMsPackageDto,
  ) {
    try {
      const data = await this.msPackageService.update(+id, updateMsPackageDto);

      if (!data) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            success: false,
            message: `Package with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        status: HttpStatus.OK,
        success: true,
        message: `Package updated successfully`,
        data,
      };
    } catch (error: unknown) {
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: `Failed to update package with id ${id}`,
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Delete a service package by ID.
   * Restricted to ADMIN role.
   * @param id - Package ID (path parameter)
   * @returns Null data on successful deletion.
   */
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.msPackageService.remove(+id);
      return {
        status: HttpStatus.OK,
        success: true,
        message: `Package successfully`,
        data: {},
      };
    } catch (error: unknown) {
      // Handle and sanitize error before returning
      const sanitizedError = sanitizeError(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          success: false,
          message: `Failed to delete package with id ${id}`,
          error: sanitizedError,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
