import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private s3: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    // Initialize S3 client with region and credentials from environment variables
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });

    // Set the target S3 bucket name
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
  }

  /**
   * Uploads a file to the specified S3 bucket and returns its public URL.
   *
   * @param buffer - The file buffer (binary data).
   * @param originalName - The original file name.
   * @param mimeType - The MIME type of the file.
   * @param folder - Optional folder path within the S3 bucket.
   * @returns The full S3 URL of the uploaded file.
   */
  async uploadMedia(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = '',
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

    return `https://${this.bucket}.s3.${this.configService.get<string>(
      'AWS_REGION',
    )}.amazonaws.com/${filename}`;
  }

  /**
   * Deletes a file from the S3 bucket based on its full public URL.
   *
   * @param key - The full URL of the file to delete.
   */
  async deleteMedia(key: string): Promise<void> {
    const Key = key.replace(
      `https://${this.bucket}.s3.${this.configService.get<string>(
        'AWS_REGION',
      )}.amazonaws.com/`,
      '',
    );

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key,
      }),
    );
  }
}
