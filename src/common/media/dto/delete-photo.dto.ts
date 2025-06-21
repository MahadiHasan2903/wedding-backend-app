import { IsString, IsUrl } from 'class-validator';

export class DeletePhotoDto {
  @IsString()
  @IsUrl()
  photoUrl: string;
}
