import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
  IsArray,
  IsNumber,
  Length,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  IsUrl,
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
  Currency,
  AccountStatus,
  PrivacySettings,
  HealthCondition,
} from '../enum/users.enum';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { isStringArray } from 'src/utils/helpers';
import { MembershipPackageDto } from './membership-package.dto';

class SocialMediaLinkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;
}

function isSocialMediaLinkArray(value: unknown): value is SocialMediaLinkDto[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== 'object' || item === null) return false;
      const obj = item as Record<string, unknown>;
      return typeof obj.name === 'string' && typeof obj.link === 'string';
    })
  );
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  userRole?: UserRole;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  motherTongue?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  profilePicture?: string;

  @IsOptional()
  additionalPhotos?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaLinkDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed: unknown = JSON.parse(value);
        if (isSocialMediaLinkArray(parsed)) {
          // convert to instances
          return plainToInstance(SocialMediaLinkDto, parsed);
        }
        return [];
      } catch {
        return [];
      }
    }
    if (isSocialMediaLinkArray(value)) {
      return plainToInstance(SocialMediaLinkDto, value);
    }
    return [];
  })
  socialMediaLinks?: SocialMediaLinkDto[];

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
  @ValidateNested()
  @Type(() => MembershipPackageDto)
  membershipPackage?: MembershipPackageDto;

  @IsOptional()
  @IsString()
  timeZone?: string;

  @IsOptional()
  @IsString()
  highestEducation?: string;

  @IsOptional()
  @IsString()
  institutionName?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  monthlyIncome?: number;

  @IsOptional()
  @IsEnum(Currency)
  incomeCurrency?: Currency;

  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @IsOptional()
  @IsEnum(PoliticalView)
  politicalView?: PoliticalView;

  @IsOptional()
  @IsEnum(LivingArrangement)
  livingArrangement?: LivingArrangement;

  @IsOptional()
  @IsNumber()
  familyMemberCount?: number;

  @IsOptional()
  @IsString()
  interestedInGender?: string;

  @IsOptional()
  @IsEnum(LookingFor)
  lookingFor?: LookingFor;

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
  politicalPreference?: string;

  @IsOptional()
  @IsString()
  partnerExpectations?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @IsOptional()
  @IsEnum(DrinkingHabit)
  drinkingHabit?: DrinkingHabit;

  @IsOptional()
  @IsEnum(SmokingHabit)
  smokingHabit?: SmokingHabit;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasPet?: boolean;

  @IsOptional()
  @IsEnum(HealthCondition)
  healthCondition?: HealthCondition;

  @IsOptional()
  @IsEnum(DietaryPreference)
  dietaryPreference?: DietaryPreference;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return isNaN(val) ? null : val;
  })
  @IsNumber()
  children?: number;

  @IsOptional()
  @IsEnum(FamilyBackground)
  familyBackground?: FamilyBackground;

  @IsOptional()
  @IsEnum(CulturalPractices)
  culturalPractices?: CulturalPractices;

  @IsOptional()
  @IsEnum(AstrologicalSign)
  astrologicalSign?: AstrologicalSign;

  @IsOptional()
  @IsEnum(LoveLanguage)
  loveLanguage?: LoveLanguage;

  @IsOptional()
  @IsString()
  favoriteQuote?: string;

  @IsOptional()
  @IsEnum(PrivacySettings)
  profileVisibility?: PrivacySettings;

  @IsOptional()
  @IsEnum(PrivacySettings)
  photoVisibility?: PrivacySettings;

  @IsOptional()
  @IsEnum(PrivacySettings)
  messageAvailability?: PrivacySettings;
}
