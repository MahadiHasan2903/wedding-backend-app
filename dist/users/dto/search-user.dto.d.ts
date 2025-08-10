import { DietaryPreference, DrinkingHabit, Gender, HealthCondition, MaritalStatus, PoliticalView, Religion, SmokingHabit } from '../enum/users.enum';
export declare class SearchUserDto {
    page?: number;
    pageSize?: number;
    sort?: string;
    name?: string;
    age?: string;
    height?: string;
    weight?: string;
    monthlyIncome?: string;
    joined?: string;
    lookingFor?: Gender;
    religion?: Religion;
    politicalView?: PoliticalView;
    maritalStatus?: MaritalStatus;
    hasChildren?: boolean;
    hasPet?: boolean;
    country?: string;
    accountType?: string;
    city?: string;
    languageSpoken?: string;
    education?: string;
    profession?: string;
    familyMember?: string;
    dietaryPreference?: DietaryPreference;
    drinkingHabit?: DrinkingHabit;
    smokingHabit?: SmokingHabit;
    healthCondition?: HealthCondition;
}
