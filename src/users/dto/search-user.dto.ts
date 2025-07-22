import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  Matches,
  IsEnum,
  IsBooleanString,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  DietaryPreference,
  DrinkingHabit,
  Gender,
  HealthCondition,
  HighestEducation,
  MaritalStatus,
  PoliticalView,
  Profession,
  Religion,
  SmokingHabit,
} from '../enum/users.enum';

export class SearchUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+,(ASC|DESC)$/i, {
    message: 'sort must be in the format "field,ASC" or "field,DESC"',
  })
  sort?: string = 'id,DESC';

  @IsOptional()
  @Matches(/^\d{1,3}-\d{1,3}$/, {
    message: 'age must be in format "min-max"',
  })
  age?: string;

  @IsOptional()
  @Matches(/^\d{1,3}-\d{1,3}$/, {
    message: 'height must be in format "min-max"',
  })
  height?: string;

  @IsOptional()
  @Matches(/^\d{1,3}-\d{1,3}$/, {
    message: 'weight must be in format "min-max"',
  })
  weight?: string;

  @IsOptional()
  @Matches(/^\d+-\d+$/, {
    message: 'monthly income must be in format "min-max"',
  })
  monthlyIncome?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2} - \d{4}-\d{2}-\d{2}$/, {
    message: 'joined must be in format "YYYY-MM-DD - YYYY-MM-DD"',
  })
  joined?: string;

  @IsOptional()
  @IsEnum(Gender)
  lookingFor?: Gender;

  @IsOptional()
  @IsEnum(Religion)
  religion?: Religion;

  @IsOptional()
  @IsEnum(PoliticalView)
  politicalView?: PoliticalView;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasChildren?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasPet?: boolean;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  languageSpoken?: string;

  @IsOptional()
  @IsEnum(HighestEducation)
  education?: HighestEducation;

  @IsOptional()
  @IsEnum(Profession)
  profession?: Profession;

  @IsOptional()
  @Matches(/^\d+-\d+$/, {
    message: 'family member must be in format "min-max"',
  })
  familyMember?: string;

  @IsOptional()
  @IsEnum(DietaryPreference)
  dietaryPreference?: DietaryPreference;

  @IsOptional()
  @IsEnum(DrinkingHabit)
  drinkingHabit?: DrinkingHabit;

  @IsOptional()
  @IsEnum(SmokingHabit)
  smokingHabit?: SmokingHabit;

  @IsOptional()
  @IsEnum(HealthCondition)
  healthCondition?: HealthCondition;
}
