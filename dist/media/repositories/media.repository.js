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
exports.MediaRepository = void 0;
const path = require("path");
const typeorm_1 = require("typeorm");
const media_entity_1 = require("../entities/media.entity");
const common_1 = require("@nestjs/common");
let MediaRepository = class MediaRepository extends typeorm_1.Repository {
    dataSource;
    constructor(dataSource) {
        super(media_entity_1.Media, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findAll() {
        return this.find();
    }
    async findById(id) {
        return this.findOne({ where: { id } });
    }
    async createAndSaveMedia(s3Url, file, collectionName, folder) {
        const filename = path.basename(s3Url, path.extname(s3Url));
        const media = this.create({
            collectionName,
            filename,
            originalName: file.originalname,
            extension: path.extname(file.originalname),
            mimetype: file.mimetype,
            size: file.size,
            directory: folder,
            disk: 's3',
            url: s3Url,
        });
        return this.save(media);
    }
    async deleteById(id) {
        const media = await this.findOneBy({ id });
        if (!media)
            return null;
        await this.remove(media);
        return media;
    }
};
exports.MediaRepository = MediaRepository;
exports.MediaRepository = MediaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MediaRepository);
//# sourceMappingURL=media.repository.js.map