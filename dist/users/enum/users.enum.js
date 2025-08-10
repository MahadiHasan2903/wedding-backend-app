"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCondition = exports.Profession = exports.HighestEducation = exports.LikeStatus = exports.BlockStatus = exports.PrivacySettings = exports.LoveLanguage = exports.AstrologicalSign = exports.CulturalPractices = exports.FamilyBackground = exports.DietaryPreference = exports.SmokingHabit = exports.DrinkingHabit = exports.BodyType = exports.ReligionPreference = exports.LookingFor = exports.LivingArrangement = exports.PoliticalView = exports.Religion = exports.Currency = exports.AccountStatus = exports.UserRole = exports.MaritalStatus = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["NON_BINARY"] = "non_binary";
    Gender["OTHER"] = "other";
    Gender["NOT_SHARED"] = "not_shared";
})(Gender || (exports.Gender = Gender = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "single";
    MaritalStatus["MARRIED"] = "married";
    MaritalStatus["DIVORCED"] = "divorced";
    MaritalStatus["WIDOWED"] = "widowed";
    MaritalStatus["SEPARATED"] = "separated";
    MaritalStatus["COMPLICATED"] = "complicated";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["INACTIVE"] = "inactive";
    AccountStatus["BLOCK"] = "block";
    AccountStatus["BANNED"] = "banned";
    AccountStatus["DELETE"] = "delete";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var Currency;
(function (Currency) {
    Currency["USD"] = "usd";
    Currency["EURO"] = "euro";
})(Currency || (exports.Currency = Currency = {}));
var Religion;
(function (Religion) {
    Religion["ISLAM"] = "islam";
    Religion["HINDUISM"] = "hinduism";
    Religion["CHRISTIANITY"] = "christianity";
    Religion["BUDDHISM"] = "buddhism";
    Religion["JUDAISM"] = "judaism";
    Religion["NONE"] = "none";
    Religion["OTHER"] = "other";
})(Religion || (exports.Religion = Religion = {}));
var PoliticalView;
(function (PoliticalView) {
    PoliticalView["LIBERAL"] = "liberal";
    PoliticalView["CONSERVATIVE"] = "conservative";
    PoliticalView["MODERATE"] = "moderate";
    PoliticalView["APOLITICAL"] = "apolitical";
    PoliticalView["OTHER"] = "other";
    PoliticalView["NOT_SHARED"] = "not_shared";
})(PoliticalView || (exports.PoliticalView = PoliticalView = {}));
var LivingArrangement;
(function (LivingArrangement) {
    LivingArrangement["WITH_FAMILY"] = "with_family";
    LivingArrangement["OWN_APARTMENT"] = "own_apartment";
    LivingArrangement["SHARED"] = "shared_accommodation";
    LivingArrangement["DORMITORY"] = "dormitory";
    LivingArrangement["OTHER"] = "other";
})(LivingArrangement || (exports.LivingArrangement = LivingArrangement = {}));
var LookingFor;
(function (LookingFor) {
    LookingFor["MARRIAGE"] = "marriage";
    LookingFor["LONG_TERM"] = "long_term_relationship";
    LookingFor["FRIENDSHIP"] = "friendship";
    LookingFor["CASUAL"] = "casual_dating";
    LookingFor["OTHER"] = "other";
})(LookingFor || (exports.LookingFor = LookingFor = {}));
var ReligionPreference;
(function (ReligionPreference) {
    ReligionPreference["SAME_RELIGION"] = "same_religion";
    ReligionPreference["ISLAM"] = "islam";
    ReligionPreference["HINDUISM"] = "hinduism";
    ReligionPreference["CHRISTIANITY"] = "christianity";
    ReligionPreference["BUDDHISM"] = "buddhism";
    ReligionPreference["JUDAISM"] = "judaism";
    ReligionPreference["Other"] = "other";
})(ReligionPreference || (exports.ReligionPreference = ReligionPreference = {}));
var BodyType;
(function (BodyType) {
    BodyType["ATHLETIC"] = "athletic";
    BodyType["SLIM"] = "slim";
    BodyType["AVERAGE"] = "average";
    BodyType["CURVY"] = "curvy";
    BodyType["HEAVYSET"] = "heavyset";
})(BodyType || (exports.BodyType = BodyType = {}));
var DrinkingHabit;
(function (DrinkingHabit) {
    DrinkingHabit["NEVER"] = "never";
    DrinkingHabit["OCCASIONALLY"] = "occasionally";
    DrinkingHabit["REGULARLY"] = "regularly";
    DrinkingHabit["SOCIALLY"] = "socially";
})(DrinkingHabit || (exports.DrinkingHabit = DrinkingHabit = {}));
var SmokingHabit;
(function (SmokingHabit) {
    SmokingHabit["NON_SMOKER"] = "non_smoker";
    SmokingHabit["SOCIAL_SMOKER"] = "social_smoker";
    SmokingHabit["REGULAR_SMOKER"] = "regular_smoker";
})(SmokingHabit || (exports.SmokingHabit = SmokingHabit = {}));
var DietaryPreference;
(function (DietaryPreference) {
    DietaryPreference["VEGETARIAN"] = "vegetarian";
    DietaryPreference["NON_VEGETARIAN"] = "non_vegetarian";
    DietaryPreference["VEGAN"] = "vegan";
    DietaryPreference["HALAL"] = "halal";
    DietaryPreference["KOSHER"] = "kosher";
    DietaryPreference["OTHER"] = "other";
})(DietaryPreference || (exports.DietaryPreference = DietaryPreference = {}));
var FamilyBackground;
(function (FamilyBackground) {
    FamilyBackground["TRADITIONAL"] = "traditional";
    FamilyBackground["MODERN"] = "modern";
    FamilyBackground["MIDDLE_CLASS"] = "middle_class";
    FamilyBackground["UPPER_CLASS"] = "upper_class";
    FamilyBackground["WORKING_CLASS"] = "working_class";
})(FamilyBackground || (exports.FamilyBackground = FamilyBackground = {}));
var CulturalPractices;
(function (CulturalPractices) {
    CulturalPractices["MODERN"] = "modern_lifestyle";
    CulturalPractices["MIXED"] = "mixed_culture";
    CulturalPractices["TRADITIONAL"] = "traditional_lifestyle";
    CulturalPractices["CONSERVATIVE"] = "conservative_values";
    CulturalPractices["LIBERAL"] = "liberal_values";
    CulturalPractices["URBAN"] = "urban_culture";
    CulturalPractices["RURAL"] = "rural_culture";
    CulturalPractices["FAMILY_ORIENTED"] = "family_oriented";
    CulturalPractices["SPIRITUAL"] = "spiritual_practices";
    CulturalPractices["GLOBAL"] = "global_outlook";
})(CulturalPractices || (exports.CulturalPractices = CulturalPractices = {}));
var AstrologicalSign;
(function (AstrologicalSign) {
    AstrologicalSign["ARIES"] = "aries";
    AstrologicalSign["TAURUS"] = "taurus";
    AstrologicalSign["GEMINI"] = "gemini";
    AstrologicalSign["CANCER"] = "cancer";
    AstrologicalSign["LEO"] = "leo";
    AstrologicalSign["VIRGO"] = "virgo";
    AstrologicalSign["LIBRA"] = "libra";
    AstrologicalSign["SCORPIO"] = "scorpio";
    AstrologicalSign["SAGITTARIUS"] = "sagittarius";
    AstrologicalSign["CAPRICORN"] = "capricorn";
    AstrologicalSign["AQUARIUS"] = "aquarius";
    AstrologicalSign["PISCES"] = "pisces";
})(AstrologicalSign || (exports.AstrologicalSign = AstrologicalSign = {}));
var LoveLanguage;
(function (LoveLanguage) {
    LoveLanguage["WORDS"] = "words_of_affirmation";
    LoveLanguage["ACTS"] = "acts_of_service";
    LoveLanguage["GIFTS"] = "receiving_gifts";
    LoveLanguage["TIME"] = "quality_time";
    LoveLanguage["TOUCH"] = "physical_touch";
})(LoveLanguage || (exports.LoveLanguage = LoveLanguage = {}));
var PrivacySettings;
(function (PrivacySettings) {
    PrivacySettings["EVERYONE"] = "everyone";
    PrivacySettings["CONNECTIONS"] = "connections";
    PrivacySettings["PREMIUM_MEMBERS"] = "premium_members";
})(PrivacySettings || (exports.PrivacySettings = PrivacySettings = {}));
var BlockStatus;
(function (BlockStatus) {
    BlockStatus["BLOCK"] = "block";
    BlockStatus["UNBLOCK"] = "unblock";
})(BlockStatus || (exports.BlockStatus = BlockStatus = {}));
var LikeStatus;
(function (LikeStatus) {
    LikeStatus["LIKE"] = "like";
    LikeStatus["DISLIKE"] = "dislike";
})(LikeStatus || (exports.LikeStatus = LikeStatus = {}));
var HighestEducation;
(function (HighestEducation) {
    HighestEducation["NO_FORMAL_EDUCATION"] = "no_formal_education";
    HighestEducation["PRIMARY_EDUCATION"] = "primary_education";
    HighestEducation["SECONDARY_EDUCATION"] = "secondary_education";
    HighestEducation["HIGH_SCHOOL"] = "high_school";
    HighestEducation["DIPLOMA"] = "diploma";
    HighestEducation["BACHELORS"] = "bachelors";
    HighestEducation["MASTERS"] = "masters";
    HighestEducation["DOCTORATE"] = "doctorate";
    HighestEducation["OTHER"] = "other";
})(HighestEducation || (exports.HighestEducation = HighestEducation = {}));
var Profession;
(function (Profession) {
    Profession["STUDENT"] = "student";
    Profession["ENGINEER"] = "engineer";
    Profession["DOCTOR"] = "doctor";
    Profession["TEACHER"] = "teacher";
    Profession["LAWYER"] = "lawyer";
    Profession["BUSINESS"] = "business";
    Profession["GOVERNMENT_EMPLOYEE"] = "government_employee";
    Profession["PRIVATE_JOB"] = "private_job";
    Profession["SELF_EMPLOYED"] = "self_employed";
    Profession["FREELANCER"] = "freelancer";
    Profession["ARTIST"] = "artist";
    Profession["UNEMPLOYED"] = "unemployed";
    Profession["RETIRED"] = "retired";
    Profession["OTHER"] = "other";
})(Profession || (exports.Profession = Profession = {}));
var HealthCondition;
(function (HealthCondition) {
    HealthCondition["HEALTHY"] = "healthy";
    HealthCondition["MINOR_ISSUES"] = "minor_issues";
    HealthCondition["CHRONIC_CONDITION"] = "chronic_condition";
    HealthCondition["DISABLED"] = "disabled";
    HealthCondition["MENTAL_HEALTH_ISSUES"] = "mental_health_issues";
    HealthCondition["VISUALLY_IMPAIRED"] = "visually_impaired";
    HealthCondition["HEARING_IMPAIRED"] = "hearing_impaired";
    HealthCondition["NOT_DISCLOSED"] = "not_disclosed";
    HealthCondition["OTHER"] = "other";
})(HealthCondition || (exports.HealthCondition = HealthCondition = {}));
//# sourceMappingURL=users.enum.js.map