import { PriceOption } from 'src/ms-package/entities/msPackage.entity';

export interface PurchasedMembershipInfo {
  id: number;
  userId: number;
  purchasedAt: Date;
  expiresAt?: Date;
  membershipPackageInfo: {
    id: number;
    title: string;
    description: string;
    priceOption: PriceOption | null;
  };
}
