import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { Media } from './entities/media.entity';
import { MediaRepository } from './repositories/media.repository';

@Injectable()
export class MediaService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  /**
   * MediaService constructor initializes AWS S3 client and configures
   * repository and bucket information from environment variables.
   *
   * @param configService - Provides access to environment variables.
   * @param mediaRepository - TypeORM repository for Media entity.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly mediaRepository: MediaRepository,
  ) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  /**
   * Retrieves all Media records from the database.
   *
   * @returns Promise resolving to an array of Media entities.
   */
  async getAll(): Promise<Media[]> {
    return this.mediaRepository.findAll();
  }

  /**
   * Retrieves a single Media entity by its ID.
   * Throws NotFoundException if no record exists.
   *
   * @param id - The ID of the Media record.
   * @returns Promise resolving to the Media entity.
   */
  async getOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found`);
    }
    return media;
  }

  /**
   * Deletes a Media record by its ID, including removing the file from S3 storage.
   *
   * Steps:
   * 1. Retrieves the Media entity by ID.
   * 2. Deletes the corresponding file from the S3 bucket.
   * 3. Removes the Media record from the database.
   *
   * @param id - The ID of the Media record to delete.
   */
  async deleteMediaById(id: number): Promise<void> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException();
    }
    await this.deleteFromS3(media.url);
    await this.mediaRepository.remove(media);
  }

  /**
   * Uploads a file buffer to S3 under the specified folder path,
   * then creates and persists a Media record in the database.
   *
   * @param file - The uploaded file object from Multer.
   * @param collectionName - The collection name.
   * @param folder - The folder prefix inside the S3 bucket to upload to.
   * @returns Promise resolving to the saved Media entity.
   */
  async handleUpload(
    file: Express.Multer.File,
    collectionName: string,
    folder: string,
  ): Promise<Media> {
    // Upload the file buffer to S3 and get its public URL
    const s3Url = await this.uploadToS3(
      file.buffer,
      file.mimetype,
      file.originalname,
      folder,
    );

    return this.mediaRepository.createAndSaveMedia(
      s3Url,
      file,
      collectionName,
      folder,
    );
  }

  /**
   * Uploads a file buffer to AWS S3 under the specified folder and
   * generates a unique filename to prevent collisions.
   *
   * @param buffer - The file data buffer.
   * @param mimeType - The MIME type of the file.
   * @param originalName - Original filename of the uploaded file.
   * @param folder - Folder path prefix inside the S3 bucket.
   * @returns Promise resolving to the public S3 URL of the uploaded file.
   */
  private async uploadToS3(
    buffer: Buffer,
    mimeType: string,
    originalName: string,
    folder: string,
  ): Promise<string> {
    const filename = `${folder}/${Date.now()}-${randomUUID()}-${originalName}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${filename}`;
  }

  /**
   * Deletes a file from AWS S3 given its full public URL.
   * Extracts the S3 object key from the URL before deleting.
   *
   * @param s3Url - Full public URL of the file to delete.
   */
  private async deleteFromS3(s3Url: string): Promise<void> {
    const key = s3Url.replace(
      `https://${this.bucket}.s3.${this.region}.amazonaws.com/`,
      '',
    );

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
