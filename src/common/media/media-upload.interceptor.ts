import { FileInterceptor } from '@nestjs/platform-express';

export function MediaUploadInterceptor(fieldName: string) {
  return FileInterceptor(fieldName);
}
