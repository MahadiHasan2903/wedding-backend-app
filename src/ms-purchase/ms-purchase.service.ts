import { Injectable, NotFoundException } from '@nestjs/common';
import { MsPurchase } from './entities/ms-purchase.entity';
import { MsPurchaseRepository } from './repositories/ms-purchase.repository';
import { MsPackageService } from 'src/ms-package/msPackage.service';
import { PurchasePackageCategory } from './enum/ms-purchase.enum';
import { PriceOptionType } from 'src/ms-package/enum/msPackage.enum';
import { PaginationOptions } from 'src/types/common.types';

@Injectable()
export class MsPurchaseService {
  constructor(
    private readonly msPurchaseRepo: MsPurchaseRepository,
    private readonly msPackageService: MsPackageService,
  ) {}

  /**
   * Find a membership purchase by its ID.
   * @param id The purchase ID.
   * @returns Promise resolving to MsPurchase or null.
   */
  findById(id: number): Promise<MsPurchase | null> {
    return this.msPurchaseRepo.findOne({ where: { id } });
  }

  /**
   * Retrieve all membership purchases.
   * @returns Promise resolving to an array of MsPurchase.
   */
  async findAll({ page, pageSize, sort }: PaginationOptions) {
    const [sortField, sortOrder] = sort.split(',');

    const [items, totalItems] = await this.msPurchaseRepo.findAndCount({
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  /**
   * Find all membership purchases made by a specific user.
   * Delegates to repository.
   * @param user The user ID number.
   * @returns Promise resolving to array of MsPurchase.
   */
  async findByUserId(
    user: number,
    { page, pageSize, sort }: PaginationOptions,
  ) {
    const [sortField, sortOrder] = sort.split(',');

    const [items, totalItems] = await this.msPurchaseRepo.findAndCount({
      where: { user },
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  /**
   * Delete a membership purchase by its ID.
   * @param id The purchase ID number.
   * @returns Promise resolving to true if deleted, false otherwise.
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.msPurchaseRepo.delete(id);
    return !!result?.affected && result.affected > 0;
  }

  /**
   * Create a new membership purchase.
   * Generates a unique transaction ID and calculates expiry based on package type.
   * Also enriches the response with package title, description, and pricing info.
   *
   * @param user User ID number
   * @param msPackageId Package ID number
   * @param packageType PackageType enum
   * @returns Promise resolving to the saved purchase plus package info.
   * @throws NotFoundException if package not found.
   */
  async createPurchase(
    user: number,
    msPackageId: number,
    packagePurchasedCategory: PurchasePackageCategory,
  ) {
    const purchasedAt = new Date();

    let expiresAt: Date | undefined;

    // Calculate expiry date based on package type
    if (packagePurchasedCategory === PurchasePackageCategory.MONTHLY) {
      expiresAt = new Date(purchasedAt);
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else if (packagePurchasedCategory === PurchasePackageCategory.YEARLY) {
      expiresAt = new Date(purchasedAt);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else if (packagePurchasedCategory === PurchasePackageCategory.LIFETIME) {
      expiresAt = undefined;
    }

    // Fetch package details for enrichment and validation
    const msPackage = await this.msPackageService.findOne(Number(msPackageId));
    if (!msPackage) {
      throw new NotFoundException(`Package with id ${msPackageId} not found`);
    }

    // Find matching price option based on package type category
    const priceOption = msPackage.priceOptions.find(
      (option) =>
        option.category ===
        (packagePurchasedCategory as unknown as PriceOptionType),
    );
    if (!priceOption) {
      throw new NotFoundException('Price option not found');
    }

    const amount = priceOption.originalPrice || 0;
    const discount = amount - priceOption.sellPrice || 0;
    const payable = amount - discount;

    const purchase = this.msPurchaseRepo.create({
      user,
      packageId: msPackageId,
      purchasePackageCategory: packagePurchasedCategory,
      purchasedAt,
      expiresAt,
      amount,
      discount,
      payable,
    });

    const savedPurchase = await this.msPurchaseRepo.save(purchase);

    const { packageId, purchasePackageCategory, ...purchaseWithoutPackage } =
      savedPurchase;

    return {
      ...purchaseWithoutPackage,
      membershipPackageInfo: {
        id: msPackage.id,
        title: msPackage.title,
        description: msPackage.description,
        priceOption: priceOption || null,
      },
    };
  }
}
