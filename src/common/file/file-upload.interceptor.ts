import { FileInterceptor } from '@nestjs/platform-express';

export function FileUploadInterceptor(fieldName: string) {
  return FileInterceptor(fieldName);
}
