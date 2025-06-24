import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaRepository } from './repositories/media.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: MediaRepository,
      useFactory: (dataSource: DataSource) => {
        return new MediaRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [MediaService, MediaRepository],
})
export class MediaModule {}
