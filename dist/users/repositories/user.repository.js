"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
const date_fns_1 = require("date-fns");
const users_enum_1 = require("../enum/users.enum");
const media_service_1 = require("../../media/media.service");
const media_repository_1 = require("../../media/repositories/media.repository");
const msPackage_repository_1 = require("../../ms-package/repositories/msPackage.repository");
const ms_purchase_repository_1 = require("../../ms-purchase/repositories/ms-purchase.repository");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    dataSource;
    mediaService;
    mediaRepository;
    msPackageRepository;
    msPurchaseRepository;
    constructor(dataSource, mediaService, mediaRepository, msPackageRepository, msPurchaseRepository) {
        super(user_entity_1.User, dataSource.createEntityManager());
        this.dataSource = dataSource;
        this.mediaService = mediaService;
        this.mediaRepository = mediaRepository;
        this.msPackageRepository = msPackageRepository;
        this.msPurchaseRepository = msPurchaseRepository;
    }
    async findByIdWithoutPassword(id) {
        const user = await this.findOneBy({ id });
        if (!user) {
            return null;
        }
        const { password, ...safeUser } = user;
        return safeUser;
    }
    async findAllPaginated(page = 1, pageSize = 10, sort = 'id,DESC', filters = {}) {
        const [sortField, sortOrder] = sort.split(',');
        const qb = this.createQueryBuilder('user');
        if (filters.accountType === 'premium') {
            qb.leftJoin('membership_purchases', 'mp', 'mp.id = CAST(user.purchasedMembership AS uuid)');
            qb.andWhere('mp.packageId IN (:...vipIds)', { vipIds: [2, 3] });
        }
        if (filters.age?.includes('-')) {
            const [minAge, maxAge] = filters.age.split('-').map(Number);
            if (!isNaN(minAge) && !isNaN(maxAge)) {
                const maxDob = (0, date_fns_1.subYears)(new Date(), minAge);
                const minDob = (0, date_fns_1.subYears)(new Date(), maxAge);
                qb.andWhere('user.dateOfBirth BETWEEN :minDob AND :maxDob', {
                    minDob,
                    maxDob,
                });
            }
        }
        if (filters.height?.includes('-')) {
            const [min, max] = filters.height.split('-').map(Number);
            qb.andWhere('user.heightCm BETWEEN :min AND :max', { min, max });
        }
        if (filters.weight?.includes('-')) {
            const [min, max] = filters.weight.split('-').map(Number);
            qb.andWhere('user.weightKg BETWEEN :min AND :max', { min, max });
        }
        if (filters.familyMember?.includes('-')) {
            const [min, max] = filters.familyMember.split('-').map(Number);
            qb.andWhere('user.familyMemberCount BETWEEN :min AND :max', { min, max });
        }
        if (filters.monthlyIncome?.includes('-')) {
            const [min, max] = filters.monthlyIncome.split('-').map(Number);
            qb.andWhere('user.monthlyIncome BETWEEN :min AND :max', { min, max });
        }
        if (filters.joined?.includes(' - ')) {
            const [startDateStr, endDateStr] = filters.joined.split(' - ');
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                endDate.setHours(23, 59, 59, 999);
                qb.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });
            }
        }
        if (filters.lookingFor &&
            Object.values(users_enum_1.Gender).includes(filters.lookingFor)) {
            qb.andWhere('user.gender = :gender', { gender: filters.lookingFor });
        }
        if (filters.religion &&
            Object.values(users_enum_1.Religion).includes(filters.religion)) {
            qb.andWhere('user.religion = :religion', { religion: filters.religion });
        }
        if (filters.politicalView &&
            Object.values(users_enum_1.PoliticalView).includes(filters.politicalView)) {
            qb.andWhere('user.politicalView = :politicalView', {
                politicalView: filters.politicalView,
            });
        }
        if (filters.maritalStatus &&
            Object.values(users_enum_1.MaritalStatus).includes(filters.maritalStatus)) {
            qb.andWhere('user.maritalStatus = :maritalStatus', {
                maritalStatus: filters.maritalStatus,
            });
        }
        if (filters.dietaryPreference &&
            Object.values(users_enum_1.DietaryPreference).includes(filters.dietaryPreference)) {
            qb.andWhere('user.dietaryPreference = :dietaryPreference', {
                dietaryPreference: filters.dietaryPreference,
            });
        }
        if (filters.smokingHabit &&
            Object.values(users_enum_1.SmokingHabit).includes(filters.smokingHabit)) {
            qb.andWhere('user.smokingHabit = :smokingHabit', {
                smokingHabit: filters.smokingHabit,
            });
        }
        if (filters.healthCondition &&
            Object.values(users_enum_1.HealthCondition).includes(filters.healthCondition)) {
            qb.andWhere('user.healthCondition = :healthCondition', {
                healthCondition: filters.healthCondition,
            });
        }
        if (filters.drinkingHabit &&
            Object.values(users_enum_1.DrinkingHabit).includes(filters.drinkingHabit)) {
            qb.andWhere('user.drinkingHabit = :drinkingHabit', {
                drinkingHabit: filters.drinkingHabit,
            });
        }
        if (filters.name) {
            qb.andWhere(new typeorm_1.Brackets((qb) => {
                qb.where('user.firstName ILIKE :name').orWhere('user.lastName ILIKE :name');
            }), { name: `%${filters.name}%` });
        }
        if (filters.country) {
            qb.andWhere('user.country = :country', { country: filters.country });
        }
        if (filters.city) {
            qb.andWhere('user.city = :city', { city: filters.city });
        }
        if (filters.languageSpoken) {
            qb.andWhere('user.motherTongue = :languageSpoken', {
                languageSpoken: filters.languageSpoken,
            });
        }
        if (filters.education) {
            qb.andWhere('user.highestEducation ILIKE :education', {
                education: `%${filters.education}%`,
            });
        }
        if (filters.profession) {
            qb.andWhere('user.profession ILIKE :profession', {
                profession: `%${filters.profession}%`,
            });
        }
        if (filters.hasChildren !== undefined) {
            if (filters.hasChildren) {
                qb.andWhere('user.children > 0');
            }
            else {
                qb.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.where('user.children = 0').orWhere('user.children IS NULL');
                }));
            }
        }
        if (filters.hasPet !== undefined) {
            if (filters.hasPet) {
                qb.andWhere('user.hasPet = true');
            }
            else {
                qb.andWhere(new typeorm_1.Brackets((qb) => {
                    qb.where('user.hasPet = false').orWhere('user.hasPet IS NULL');
                }));
            }
        }
        qb.orderBy(`user.${sortField}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
        qb.skip((page - 1) * pageSize).take(pageSize);
        const [items, totalItems] = await qb.getManyAndCount();
        const safeItems = items.map(({ password, ...rest }) => rest);
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            items: safeItems,
            totalItems,
            itemsPerPage: pageSize,
            currentPage: page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
        };
    }
    async enrichUserRelations(user) {
        let fullProfilePicture = null;
        let fullAdditionalPhotos = [];
        let purchasedMembershipInfo = null;
        if (user.profilePicture) {
            try {
                fullProfilePicture = await this.mediaService.getOne(user.profilePicture);
            }
            catch {
                fullProfilePicture = null;
            }
        }
        if (user.additionalPhotos?.length) {
            fullAdditionalPhotos = await this.mediaRepository.find({
                where: { id: (0, typeorm_1.In)(user.additionalPhotos) },
            });
        }
        if (user.purchasedMembership) {
            const purchaseInfo = await this.msPurchaseRepository.findOne({
                where: { id: user.purchasedMembership },
            });
            if (purchaseInfo) {
                const { packageId, purchasePackageCategory, ...purchaseWithoutPackage } = purchaseInfo;
                if (packageId) {
                    const msPackage = await this.msPackageRepository.findOne({
                        where: { id: packageId },
                    });
                    if (msPackage) {
                        purchasedMembershipInfo = {
                            ...purchaseWithoutPackage,
                            membershipPackageInfo: {
                                id: msPackage.id,
                                title: msPackage.title,
                                description: msPackage.description,
                                categoryInfo: msPackage.categoryInfo,
                            },
                        };
                    }
                }
            }
        }
        return {
            ...user,
            profilePicture: fullProfilePicture,
            additionalPhotos: fullAdditionalPhotos,
            purchasedMembership: purchasedMembershipInfo,
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        media_service_1.MediaService,
        media_repository_1.MediaRepository,
        msPackage_repository_1.MsPackageRepository,
        ms_purchase_repository_1.MsPurchaseRepository])
], UserRepository);
//# sourceMappingURL=user.repository.js.map