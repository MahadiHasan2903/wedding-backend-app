import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
  IsArray,
  IsUrl,
  IsNumber,
  IsBoolean,
  IsObject,
  Length,
} from 'class-validator';

import {
  Gender,
  MaritalStatus,
  UserRole,
  Religion,
  PoliticalView,
  LivingArrangement,
  LookingFor,
  ReligionPreference,
  BodyType,
  DrinkingHabit,
  SmokingHabit,
  DietaryPreference,
  FamilyBackground,
  CulturalPractices,
  AstrologicalSign,
  LoveLanguage,
  MembershipPackage,
  Currency,
  AccountStatus,
} from '../enum/users.enum';
import { Transform } from 'class-transformer';
import { isStringArray } from 'src/utils/helpers';

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  userRole?: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  nationality: string;

  @IsString()
  motherTongue?: string;

  @IsString()
  city: string;

  @IsEnum(MaritalStatus)
  maritalStatus: MaritalStatus;

  @IsOptional()
  profilePicture?: string;

  @IsOptional()
  additionalPhotos?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (isStringArray(parsed)) {
          return parsed;
        }
        return [];
      } catch {
        return [];
      }
    }
    if (isStringArray(value)) {
      return value;
    }
    return [];
  })
  socialMediaLinks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (isStringArray(parsed)) {
          return parsed;
        }
        return [];
      } catch {
        return [];
      }
    }
    if (isStringArray(value)) {
      return value;
    }
    return [];
  })
  preferredLanguages?: string[];

  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @IsOptional()
  @IsEnum(MembershipPackage)
  membershipPackage?: MembershipPackage;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsString()
  highestEducation: string;

  @IsString()
  institutionName: string;

  @IsString()
  profession: string;

  @IsString()
  companyName: string;

  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  monthlyIncome: number;

  @IsEnum(Currency)
  incomeCurrency: Currency;

  @IsEnum(Religion)
  religion: Religion;

  @IsEnum(PoliticalView)
  politicalView: PoliticalView;

  @IsEnum(LivingArrangement)
  livingArrangement: LivingArrangement;

  @IsString()
  interestedInGender: string;

  @IsEnum(LookingFor)
  lookingFor: LookingFor;

  @IsOptional()
  preferredAgeRange?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (isStringArray(parsed)) {
          return parsed;
        }
        return [];
      } catch {
        return [];
      }
    }
    if (isStringArray(value)) {
      return value;
    }
    return [];
  })
  preferredNationality?: string[];

  @IsOptional()
  @IsEnum(ReligionPreference)
  religionPreference?: ReligionPreference;

  @IsOptional()
  @IsString()
  partnerExpectations?: string;

  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  weightKg: number;

  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  heightCm: number;

  @IsEnum(BodyType)
  bodyType: BodyType;

  @IsEnum(DrinkingHabit)
  drinkingHabit: DrinkingHabit;

  @IsEnum(SmokingHabit)
  smokingHabit: SmokingHabit;

  @IsOptional()
  @IsString()
  pets?: string;

  @IsString()
  healthCondition: string;

  @IsEnum(DietaryPreference)
  dietaryPreference: DietaryPreference;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  children: number;

  @IsEnum(FamilyBackground)
  familyBackground: FamilyBackground;

  @IsEnum(CulturalPractices)
  culturalPractices: CulturalPractices;

  @IsOptional()
  @IsEnum(AstrologicalSign)
  astrologicalSign?: AstrologicalSign;

  @IsOptional()
  @IsEnum(LoveLanguage)
  loveLanguage?: LoveLanguage;

  @IsOptional()
  @IsString()
  favoriteQuote?: string;
}
