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
exports.ContactRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const contact_entity_1 = require("../entities/contact.entity");
let ContactRepository = class ContactRepository extends typeorm_1.Repository {
    dataSource;
    constructor(dataSource) {
        super(contact_entity_1.Contact, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async createAndSave(data) {
        const contact = this.create(data);
        return this.save(contact);
    }
    async findAll() {
        return this.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findById(id) {
        const contact = await this.findOne({ where: { id } });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        return contact;
    }
    async updateAndSave(id, updateDto) {
        const contact = await this.findById(id);
        const updated = Object.assign(contact, updateDto);
        return this.save(updated);
    }
    async deleteById(id) {
        const contact = await this.findById(id);
        await this.remove(contact);
    }
    async findAllPaginated(page = 1, pageSize = 10, sort = 'id,DESC') {
        const [sortField, sortOrder] = sort.split(',');
        const skip = (page - 1) * pageSize;
        const [items, totalItems] = await this.findAndCount({
            order: {
                [sortField]: sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
            },
            skip,
            take: pageSize,
        });
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
exports.ContactRepository = ContactRepository;
exports.ContactRepository = ContactRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ContactRepository);
//# sourceMappingURL=contact.repository.js.map