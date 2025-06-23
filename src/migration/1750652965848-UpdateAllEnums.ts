import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAllEnums20250623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Gender
    await queryRunner.query(`
      CREATE TYPE users_gender_enum_new AS ENUM ('male','female','non_binary','other','not_shared');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "gender" TYPE users_gender_enum_new USING "gender"::text::users_gender_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_gender_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_gender_enum_new RENAME TO users_gender_enum;`,
    );

    // MaritalStatus
    await queryRunner.query(`
      CREATE TYPE users_marital_status_enum_new AS ENUM ('single','married','divorced','widowed','separated','complicated');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "maritalStatus" TYPE users_marital_status_enum_new USING "maritalStatus"::text::users_marital_status_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_marital_status_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_marital_status_enum_new RENAME TO users_marital_status_enum;`,
    );

    // UserRole
    await queryRunner.query(`
      CREATE TYPE users_user_role_enum_new AS ENUM ('admin','user');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "userRole" TYPE users_user_role_enum_new USING "userRole"::text::users_user_role_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_user_role_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_user_role_enum_new RENAME TO users_user_role_enum;`,
    );

    // AccountStatus
    await queryRunner.query(`
      CREATE TYPE users_account_status_enum_new AS ENUM ('active','inactive','block','delete');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "accountStatus" TYPE users_account_status_enum_new USING "accountStatus"::text::users_account_status_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_account_status_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_account_status_enum_new RENAME TO users_account_status_enum;`,
    );

    // MembershipPackage
    await queryRunner.query(`
      CREATE TYPE users_membership_package_enum_new AS ENUM ('basic','premium');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "membershipPackage" TYPE users_membership_package_enum_new USING "membershipPackage"::text::users_membership_package_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_membership_package_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_membership_package_enum_new RENAME TO users_membership_package_enum;`,
    );

    // Currency
    await queryRunner.query(`
      CREATE TYPE users_currency_enum_new AS ENUM ('usd','euro');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "incomeCurrency" TYPE users_currency_enum_new USING "incomeCurrency"::text::users_currency_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_currency_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_currency_enum_new RENAME TO users_currency_enum;`,
    );

    // Religion
    await queryRunner.query(`
      CREATE TYPE users_religion_enum_new AS ENUM ('islam','hinduism','christianity','buddhism','judaism','none','other');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "religion" TYPE users_religion_enum_new USING "religion"::text::users_religion_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_religion_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_religion_enum_new RENAME TO users_religion_enum;`,
    );

    // PoliticalView
    await queryRunner.query(`
      CREATE TYPE users_political_view_enum_new AS ENUM ('liberal','conservative','moderate','apolitical','other','not_shared');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "politicalView" TYPE users_political_view_enum_new USING "politicalView"::text::users_political_view_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_political_view_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_political_view_enum_new RENAME TO users_political_view_enum;`,
    );

    // LivingArrangement
    await queryRunner.query(`
      CREATE TYPE users_living_arrangement_enum_new AS ENUM ('with_family','own_apartment','shared_accommodation','dormitory','other');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "livingArrangement" TYPE users_living_arrangement_enum_new USING "livingArrangement"::text::users_living_arrangement_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_living_arrangement_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_living_arrangement_enum_new RENAME TO users_living_arrangement_enum;`,
    );

    // LookingFor
    await queryRunner.query(`
      CREATE TYPE users_looking_for_enum_new AS ENUM ('marriage','long_term_relationship','friendship','casual_dating','other');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "lookingFor" TYPE users_looking_for_enum_new USING "lookingFor"::text::users_looking_for_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_looking_for_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_looking_for_enum_new RENAME TO users_looking_for_enum;`,
    );

    // ReligionPreference
    await queryRunner.query(`
      CREATE TYPE users_religion_preference_enum_new AS ENUM ('same_religion','islam','hinduism','christianity','buddhism','judaism','any');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "religionPreference" TYPE users_religion_preference_enum_new USING "religionPreference"::text::users_religion_preference_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_religion_preference_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_religion_preference_enum_new RENAME TO users_religion_preference_enum;`,
    );

    // BodyType
    await queryRunner.query(`
      CREATE TYPE users_body_type_enum_new AS ENUM ('athletic','slim','average','curvy','heavyset');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "bodyType" TYPE users_body_type_enum_new USING "bodyType"::text::users_body_type_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_body_type_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_body_type_enum_new RENAME TO users_body_type_enum;`,
    );

    // DrinkingHabit
    await queryRunner.query(`
      CREATE TYPE users_drinking_habit_enum_new AS ENUM ('never','occasionally','regularly','socially');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "drinkingHabit" TYPE users_drinking_habit_enum_new USING "drinkingHabit"::text::users_drinking_habit_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_drinking_habit_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_drinking_habit_enum_new RENAME TO users_drinking_habit_enum;`,
    );

    // SmokingHabit
    await queryRunner.query(`
      CREATE TYPE users_smoking_habit_enum_new AS ENUM ('non_smoker','social_smoker','regular_smoker');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "smokingHabit" TYPE users_smoking_habit_enum_new USING "smokingHabit"::text::users_smoking_habit_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_smoking_habit_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_smoking_habit_enum_new RENAME TO users_smoking_habit_enum;`,
    );

    // DietaryPreference
    await queryRunner.query(`
      CREATE TYPE users_dietary_preference_enum_new AS ENUM ('vegetarian','non_vegetarian','vegan','halal','kosher','other');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "dietaryPreference" TYPE users_dietary_preference_enum_new USING "dietaryPreference"::text::users_dietary_preference_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_dietary_preference_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_dietary_preference_enum_new RENAME TO users_dietary_preference_enum;`,
    );

    // FamilyBackground
    await queryRunner.query(`
      CREATE TYPE users_family_background_enum_new AS ENUM ('traditional','modern','middle_class','upper_class','working_class');
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "familyBackground" TYPE users_family_background_enum_new USING "familyBackground"::text::users_family_background_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_family_background_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_family_background_enum_new RENAME TO users_family_background_enum;`,
    );

    // CulturalPractices
    await queryRunner.query(`
      CREATE TYPE users_cultural_practices_enum_new AS ENUM (
        'modern_lifestyle',
        'mixed_culture',
        'traditional_lifestyle',
        'conservative_values',
        'liberal_values',
        'urban_culture',
        'rural_culture',
        'family_oriented',
        'spiritual_practices',
        'global_outlook'
      );
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "culturalPractices" TYPE users_cultural_practices_enum_new USING "culturalPractices"::text::users_cultural_practices_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_cultural_practices_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_cultural_practices_enum_new RENAME TO users_cultural_practices_enum;`,
    );

    // AstrologicalSign
    await queryRunner.query(`
      CREATE TYPE users_astrological_sign_enum_new AS ENUM (
        'aries',
        'taurus',
        'gemini',
        'cancer',
        'leo',
        'virgo',
        'libra',
        'scorpio',
        'sagittarius',
        'capricorn',
        'aquarius',
        'pisces'
      );
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "astrologicalSign" TYPE users_astrological_sign_enum_new USING "astrologicalSign"::text::users_astrological_sign_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_astrological_sign_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_astrological_sign_enum_new RENAME TO users_astrological_sign_enum;`,
    );

    // LoveLanguage
    await queryRunner.query(`
      CREATE TYPE users_love_language_enum_new AS ENUM (
        'words_of_affirmation',
        'acts_of_service',
        'receiving_gifts',
        'quality_time',
        'physical_touch'
      );
    `);
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "loveLanguage" TYPE users_love_language_enum_new USING "loveLanguage"::text::users_love_language_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_love_language_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_love_language_enum_new RENAME TO users_love_language_enum;`,
    );

    // PrivacySettings - used for 3 columns
    await queryRunner.query(`
      CREATE TYPE users_privacy_settings_enum_new AS ENUM ('everyone','connections','premium_members');
    `);
    // profileVisibility
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "profileVisibility" TYPE users_privacy_settings_enum_new USING "profileVisibility"::text::users_privacy_settings_enum_new;
    `);
    // photoVisibility
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "photoVisibility" TYPE users_privacy_settings_enum_new USING "photoVisibility"::text::users_privacy_settings_enum_new;
    `);
    // messageAvailability
    await queryRunner.query(`
      ALTER TABLE users ALTER COLUMN "messageAvailability" TYPE users_privacy_settings_enum_new USING "messageAvailability"::text::users_privacy_settings_enum_new;
    `);
    await queryRunner.query(`DROP TYPE users_privacy_settings_enum;`);
    await queryRunner.query(
      `ALTER TYPE users_privacy_settings_enum_new RENAME TO users_privacy_settings_enum;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Implement if rollback is needed
  }
}
