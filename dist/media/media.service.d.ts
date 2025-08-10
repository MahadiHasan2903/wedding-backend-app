import { ConfigService } from '@nestjs/config';
import { Media } from './entities/media.entity';
import { MediaRepository } from './repositories/media.repository';
export declare class MediaService {
    private readonly configService;
    private readonly mediaRepository;
    private readonly s3;
    private readonly bucket;
    private readonly region;
    constructor(configService: ConfigService, mediaRepository: MediaRepository);
    getAll(): Promise<Media[]>;
    getOne(id: string): Promise<Media>;
    deleteMediaById(id: string): Promise<void>;
    handleUpload(file: Express.Multer.File, collectionName: string, folder: string): Promise<Media>;
    private uploadToS3;
    private deleteFromS3;
}
