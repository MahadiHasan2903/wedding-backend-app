import { Injectable, NotFoundException } from '@nestjs/common';
import { MsPurchase } from './entities/ms-purchase.entity';
import { MsPurchaseRepository } from './repositories/ms-purchase.repository';
import { MsPackageService } from 'src/ms-package/msPackage.service';
import {
  PaymentStatus,
  PurchasePackageCategory,
  PurchaseStatus,
} from './enum/ms-purchase.enum';
import { PaginationOptions } from 'src/types/common.types';
import { AccountRepository } from 'src/account/repositories/account.repository';

@Injectable()
export class MsPurchaseService {
  constructor(
    private readonly msPurchaseRepo: MsPurchaseRepository,
    private readonly accountRepo: AccountRepository,
    private readonly msPackageService: MsPackageService,
  ) {}

  /**
   * Find a membership purchase by its ID.
   * @param id The purchase ID.
   * @returns Promise resolving to MsPurchase or null.
   */
  findById(id: string): Promise<MsPurchase | null> {
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

    const totalPages = Math.ceil(totalItems / pageSize);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      items,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }

  /**
   * Find all membership purchases made by a specific user.
   * Delegates to repository.
   * @param userId The user ID number.
   * @returns Promise resolving to array of MsPurchase.
   */
  async findByUserId(
    userId: string,
    { page, pageSize, sort }: PaginationOptions,
  ) {
    const [sortField, sortOrder] = sort.split(',');

    const [items, totalItems] = await this.msPurchaseRepo.findAndCount({
      where: { user: userId },
      order: {
        [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalItems / pageSize);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      items,
      totalItems,
      itemsPerPage: pageSize,
      currentPage: page,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
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
   * @param userId User ID number
   * @param msPackageId Package ID number
   * @param packageType PackageType enum
   * @returns Promise resolving to the saved purchase plus package info.
   * @throws NotFoundException if package not found.
   */
  async createPurchase(
    userId: string,
    msPackageId: number,
    packagePurchasedCategory: PurchasePackageCategory,
  ) {
    const purchasedAt = new Date();

    let expiresAt: Date | undefined;

    // Calculate expiry date based on package type
    if (packagePurchasedCategory === PurchasePackageCategory.MONTHLY_PREMIUM) {
      expiresAt = new Date(purchasedAt);
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else if (
      packagePurchasedCategory === PurchasePackageCategory.LIFETIME_PREMIUM
    ) {
      expiresAt = new Date(purchasedAt);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1000);
    } else if (
      packagePurchasedCategory === PurchasePackageCategory.LIFETIME_FREE
    ) {
      expiresAt = undefined;
    }

    // Fetch package details for enrichment and validation
    const msPackage = await this.msPackageService.findOne(Number(msPackageId));
    if (!msPackage) {
      throw new NotFoundException(`Package with id ${msPackageId} not found`);
    }

    const amount = msPackage.categoryInfo.originalPrice || 0;
    const discount = amount - msPackage.categoryInfo.sellPrice || 0;
    const payable = amount - discount;

    const purchase = this.msPurchaseRepo.create({
      user: userId,
      packageId: msPackageId,
      purchasePackageCategory: packagePurchasedCategory,
      purchasedAt,
      expiresAt,
      amount,
      discount,
      payable,
      status:
        msPackageId === 1 ? PurchaseStatus.SUCCEEDED : PurchaseStatus.PENDING,
      paymentStatus:
        msPackageId === 1 ? PaymentStatus.PAID : PaymentStatus.PENDING,
    });

    const savedPurchase = await this.msPurchaseRepo.save(purchase);

    // Automatically update user's purchasedMembership for free default package
    if (msPackageId === 1) {
      await this.accountRepo.update(userId, {
        purchasedMembership: savedPurchase.id,
      });
    }

    const { packageId, purchasePackageCategory, ...purchaseWithoutPackage } =
      savedPurchase;

    return {
      ...purchaseWithoutPackage,
      membershipPackageInfo: {
        id: msPackage.id,
        title: msPackage.title,
        description: msPackage.description,
        categoryInfo: msPackage.categoryInfo || null,
      },
    };
  }
}
