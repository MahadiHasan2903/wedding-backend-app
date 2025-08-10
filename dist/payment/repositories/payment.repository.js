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
exports.PaymentRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("../entities/payment.entity");
let PaymentRepository = class PaymentRepository {
    repo;
    constructor(dataSource) {
        this.repo = dataSource.getRepository(payment_entity_1.Payment);
    }
    create(data) {
        return this.repo.create(data);
    }
    save(payment) {
        return this.repo.save(payment);
    }
    findAll() {
        return this.repo.find();
    }
    findByUserId(user) {
        return this.repo.find({ where: { user } });
    }
    findOneByTransactionId(transactionId) {
        return this.repo.findOne({ where: { transactionId } });
    }
    findAndCount(options) {
        return this.repo.findAndCount(options);
    }
    async findFilteredAndPaginated(page = 1, pageSize = 10, sort = 'id,DESC', filters = {}, userId) {
        const [sortField, sortOrder] = sort.split(',');
        const qb = this.repo.createQueryBuilder('payment');
        if (userId) {
            qb.andWhere('payment.user = :userId', { userId });
        }
        if (filters.gateway) {
            qb.andWhere('payment.gateway = :gateway', { gateway: filters.gateway });
        }
        if (filters.paymentStatus) {
            qb.andWhere('payment.paymentStatus = :paymentStatus', {
                paymentStatus: filters.paymentStatus,
            });
        }
        if (filters.dateRange?.includes(' - ')) {
            const [startDateStr, endDateStr] = filters.dateRange.split(' - ');
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                endDate.setHours(23, 59, 59, 999);
                qb.andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                });
            }
        }
        qb.orderBy(`payment.${sortField}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
        const skip = (page - 1) * pageSize;
        qb.skip(skip).take(pageSize);
        const [items, totalItems] = await qb.getManyAndCount();
        const totalPages = Math.ceil(totalItems / pageSize);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        return {
            items,
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
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map