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
exports.MsPackageService = void 0;
const common_1 = require("@nestjs/common");
const msPackage_repository_1 = require("./repositories/msPackage.repository");
let MsPackageService = class MsPackageService {
    msPackageRepo;
    constructor(msPackageRepo) {
        this.msPackageRepo = msPackageRepo;
    }
    async create(createMsPackageDto) {
        const msPackage = this.msPackageRepo.create(createMsPackageDto);
        return this.msPackageRepo.save(msPackage);
    }
    async findAll() {
        return this.msPackageRepo.find();
    }
    async findOne(id) {
        return this.msPackageRepo.findOneBy({ id });
    }
    async update(id, updateMsPackageDto) {
        const msPackage = await this.msPackageRepo.findOneBy({ id });
        if (!msPackage) {
            throw new common_1.NotFoundException(`Package with id ${id} not found`);
        }
        Object.assign(msPackage, updateMsPackageDto);
        return this.msPackageRepo.save(msPackage);
    }
    async remove(id) {
        const result = await this.msPackageRepo.delete(id);
        if (result.affected) {
            return result.affected > 0;
        }
        return false;
    }
};
exports.MsPackageService = MsPackageService;
exports.MsPackageService = MsPackageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [msPackage_repository_1.MsPackageRepository])
], MsPackageService);
//# sourceMappingURL=msPackage.service.js.map