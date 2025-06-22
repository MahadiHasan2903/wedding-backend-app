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
  IsObject,
  Length,
  Min,
  Max,
  IsBoolean,
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
} from '../../users/enum/users.enum';
import { Transform } from 'class-transformer';

export class CreateAccountDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsString()
  @Length(6, 100)
  password: string;

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
  profilePicture?: number;

  @IsOptional()
  additionalPhotos?: number[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  socialMediaLinks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLanguages?: string[];

  @IsOptional()
  @IsEnum(UserRole)
  userRole?: UserRole;

  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @IsOptional()
  @IsEnum(MembershipPackage)
  membershipPackage?: MembershipPackage;

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
  @IsObject()
  preferredAgeRange?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredNationality?: string[];

  @IsOptional()
  @IsEnum(ReligionPreference)
  religionPreference?: ReligionPreference;

  @IsOptional()
  @IsString()
  partnerExpectations?: string;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(250)
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
  hasPets?: boolean;

  @IsOptional()
  @IsString()
  healthCondition?: string;

  @IsOptional()
  @IsEnum(DietaryPreference)
  dietaryPreference?: DietaryPreference;

  @IsOptional()
  @IsNumber()
  children: number;

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
}
