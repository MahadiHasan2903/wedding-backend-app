import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Column({ nullable: true })
  nationality?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ type: 'enum', enum: MaritalStatus, nullable: true })
  maritalStatus?: MaritalStatus;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column('simple-array', { nullable: true })
  additionalPhotos?: string[];

  @Column('simple-array', { nullable: true })
  socialMediaLinks?: string[];

  @Column('simple-array', { nullable: true })
  preferredLanguages?: string[];

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  userRole: UserRole;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;

  @Column({
    type: 'enum',
    enum: MembershipPackage,
    default: MembershipPackage.BASIC,
  })
  membershipPackage: MembershipPackage;

  @Column({ nullable: true })
  timeZone?: string;

  @Column({ nullable: true })
  highestEducation?: string;

  @Column({ nullable: true })
  institutionName?: string;

  @Column({ nullable: true })
  profession?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ type: 'float', nullable: true })
  monthlyIncome?: number;

  @Column({ type: 'enum', enum: Currency, nullable: true })
  incomeCurrency?: Currency;

  @Column({ type: 'enum', enum: Religion, nullable: true })
  religion?: Religion;

  @Column({ type: 'enum', enum: PoliticalView, nullable: true })
  politicalView?: PoliticalView;

  @Column({ type: 'enum', enum: LivingArrangement, nullable: true })
  livingArrangement?: LivingArrangement;

  @Column({ nullable: true })
  interestedInGender?: string;

  @Column({ type: 'enum', enum: LookingFor, nullable: true })
  lookingFor?: LookingFor;

  @Column({ type: 'json', nullable: true })
  preferredAgeRange?: string | { min: number; max: number };

  @Column('simple-array', { nullable: true })
  preferredNationality?: string[];

  @Column({ type: 'enum', enum: ReligionPreference, nullable: true })
  religionPreference?: ReligionPreference;

  @Column({ type: 'text', nullable: true })
  partnerExpectations?: string;

  @Column({ type: 'float', nullable: true })
  weightKg?: number;

  @Column({ type: 'float', nullable: true })
  heightCm?: number;

  @Column({ type: 'enum', enum: BodyType, nullable: true })
  bodyType?: BodyType;

  @Column({ type: 'enum', enum: DrinkingHabit, nullable: true })
  drinkingHabit?: DrinkingHabit;

  @Column({ type: 'enum', enum: SmokingHabit, nullable: true })
  smokingHabit?: SmokingHabit;

  @Column({ nullable: true })
  pets?: string;

  @Column({ nullable: true })
  healthCondition?: string;

  @Column({ type: 'enum', enum: DietaryPreference, nullable: true })
  dietaryPreference?: DietaryPreference;

  @Column({ default: false })
  hasChildren: boolean;

  @Column({ type: 'enum', enum: FamilyBackground, nullable: true })
  familyBackground?: FamilyBackground;

  @Column({ type: 'enum', enum: CulturalPractices, nullable: true })
  culturalPractices?: CulturalPractices;

  @Column({ type: 'enum', enum: AstrologicalSign, nullable: true })
  astrologicalSign?: AstrologicalSign;

  @Column({ type: 'enum', enum: LoveLanguage, nullable: true })
  loveLanguage?: LoveLanguage;

  @Column({ type: 'text', nullable: true })
  favoriteQuote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
