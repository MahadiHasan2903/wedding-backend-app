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

export interface FiltersOptions {
  name?: string;
  age?: string;
  height?: string;
  weight?: string;
  joined?: string;
  monthlyIncome?: string;
  lookingFor?: string;
  religion?: string;
  country?: string;
  city?: string;
  education?: string;
  profession?: string;
  familyMember?: string;
  languageSpoken?: string;
  politicalView?: string;
  maritalStatus?: string;
  hasChildren?: boolean;
  hasPet?: boolean;
  dietaryPreference?: string;
  smokingHabit?: string;
  drinkingHabit?: string;
  healthCondition?: string;
  accountType?: string;
}
