import { User } from '../entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { PurchasedMembershipInfo } from './user-ms-purchase.types';

export type EnrichedUser = Omit<
  User,
  'password' | 'profilePicture' | 'additionalPhotos' | 'purchasedMembership'
> & {
  profilePicture: Media | null;
  additionalPhotos: Media[];
  purchasedMembership: PurchasedMembershipInfo | null;
};
