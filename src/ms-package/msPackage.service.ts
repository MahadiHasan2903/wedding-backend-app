import { Injectable, NotFoundException } from '@nestjs/common';
import { MsPackageRepository } from './repositories/msPackage.repository';
import { CreateMsPackageDto } from './dto/create-ms-package.dto';
import { UpdateMsPackageDto } from './dto/update-ms-package.dto';
import { MsPackage } from './entities/msPackage.entity';

@Injectable()
export class MsPackageService {
  constructor(private readonly msPackageRepo: MsPackageRepository) {}

  /**
   * Create a new MsPackage entity and save it to the database.
   * @param createMsPackageDto - DTO containing the package creation data.
   * @returns The newly created MsPackage entity.
   */
  async create(createMsPackageDto: CreateMsPackageDto): Promise<MsPackage> {
    const msPackage = this.msPackageRepo.create(createMsPackageDto);
    return this.msPackageRepo.save(msPackage);
  }

  /**
   * Retrieve all MsPackage entities from the database.
   * @returns An array of all MsPackage entities.
   */
  async findAll(): Promise<MsPackage[]> {
    return this.msPackageRepo.find();
  }

  /**
   * Find a MsPackage entity by its unique ID.
   * @param id - The ID of the MsPackage to retrieve.
   * @returns The MsPackage entity if found, or null if not found.
   */
  async findOne(id: number): Promise<MsPackage | null> {
    return this.msPackageRepo.findOneBy({ id });
  }

  /**
   * Update an existing MsPackage entity identified by its ID.
   * If the package exists, update its properties with the provided DTO data and save it.
   * @param id - The ID of the MsPackage to update.
   * @param updateMsPackageDto - DTO containing updated package data.
   * @returns The updated MsPackage entity if found and updated, or null if not found.
   */
  async update(
    id: number,
    updateMsPackageDto: UpdateMsPackageDto,
  ): Promise<MsPackage> {
    const msPackage = await this.msPackageRepo.findOneBy({ id });
    if (!msPackage) {
      throw new NotFoundException(`Package with id ${id} not found`);
    }
    Object.assign(msPackage, updateMsPackageDto);
    return this.msPackageRepo.save(msPackage);
  }

  /**
   * Remove a MsPackage entity by its ID.
   * @param id - The ID of the MsPackage to remove.
   * @returns True if a record was deleted, false otherwise.
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.msPackageRepo.delete(id);

    // Check if any rows were affected (deleted)
    if (result.affected) {
      return result.affected > 0;
    }
    return false;
  }
}
