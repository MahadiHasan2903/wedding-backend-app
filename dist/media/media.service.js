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
exports.MediaService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const media_repository_1 = require("./repositories/media.repository");
let MediaService = class MediaService {
    configService;
    mediaRepository;
    s3;
    bucket;
    region;
    constructor(configService, mediaRepository) {
        this.configService = configService;
        this.mediaRepository = mediaRepository;
        this.region = this.configService.getOrThrow('AWS_REGION');
        this.bucket = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
        this.s3 = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
    async getAll() {
        return this.mediaRepository.findAll();
    }
    async getOne(id) {
        const media = await this.mediaRepository.findById(id);
        if (!media) {
            throw new common_1.NotFoundException(`Media with ID ${id} not found`);
        }
        return media;
    }
    async deleteMediaById(id) {
        const media = await this.mediaRepository.findById(id);
        if (!media) {
            throw new common_1.NotFoundException();
        }
        await this.deleteFromS3(media.url);
        await this.mediaRepository.remove(media);
    }
    async handleUpload(file, collectionName, folder) {
        const s3Url = await this.uploadToS3(file.buffer, file.mimetype, file.originalname, folder);
        return this.mediaRepository.createAndSaveMedia(s3Url, file, collectionName, folder);
    }
    async uploadToS3(buffer, mimeType, originalName, folder) {
        const filename = `${folder}/${Date.now()}-${(0, crypto_1.randomUUID)()}-${originalName}`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: filename,
            Body: buffer,
            ContentType: mimeType,
        }));
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filename}`;
    }
    async deleteFromS3(s3Url) {
        const key = s3Url.replace(`https://${this.bucket}.s3.${this.region}.amazonaws.com/`, '');
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        media_repository_1.MediaRepository])
], MediaService);
//# sourceMappingURL=media.service.js.map