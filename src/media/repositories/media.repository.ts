import { DataSource, Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import * as path from 'path';

export class MediaRepository extends Repository<Media> {
  /**
   * Constructs a MediaRepository using the provided DataSource.
   * @param dataSource - The TypeORM DataSource used to create the entity manager.
   */
  constructor(private readonly dataSource: DataSource) {
    super(Media, dataSource.createEntityManager());
  }

  /**
   * Retrieves all Media records from the database.
   *
   * @returns A promise that resolves to an array of Media entities.
   */
  async findAll(): Promise<Media[]> {
    return this.find();
  }

  /**
   * Finds a single Media entity by its ID.
   *
   * @param id - The ID of the Media entity to retrieve.
   * @returns A promise that resolves to the found Media entity, or null if not found.
   */
  async findById(id: number): Promise<Media | null> {
    return this.findOne({ where: { id } });
  }

  /**
   * Creates and saves a new Media entity in the database using file metadata and S3 URL.
   *
   * @param s3Url - The public S3 URL of the uploaded file.
   * @param file - The uploaded file (from Multer).
   * @param collectionName - The logical collection/group name the media belongs to.
   * @param folder - The folder/path in S3 where the file is stored.
   * @returns A promise that resolves to the saved Media entity.
   */
  async createAndSaveMedia(
    s3Url: string,
    file: Express.Multer.File,
    collectionName: string,
    folder: string,
  ): Promise<Media> {
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

  /**
   * Deletes a Media entity by its ID, if it exists.
   *
   * @param id - The ID of the Media record to delete.
   * @returns A promise that resolves to the deleted Media entity, or null if not found.
   */
  async deleteById(id: number): Promise<Media | null> {
    const media = await this.findOneBy({ id });
    if (!media) return null;
    await this.remove(media);
    return media;
  }
}
