import { DataSource, Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
export declare class MediaRepository extends Repository<Media> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findAll(): Promise<Media[]>;
    findById(id: string): Promise<Media | null>;
    createAndSaveMedia(s3Url: string, file: Express.Multer.File, collectionName: string, folder: string): Promise<Media>;
    deleteById(id: string): Promise<Media | null>;
}
