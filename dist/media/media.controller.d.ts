import { HttpStatus } from '@nestjs/common';
import { MediaService } from './media.service';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    getAll(): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/media.entity").Media[];
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/media.entity").Media;
    }>;
    delete(id: string): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: {};
    }>;
    upload(file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        status: HttpStatus;
        data: import("./entities/media.entity").Media;
    }>;
    uploadMultipleFiles(files: {
        files?: Express.Multer.File[];
    }, body: {
        conversationId: string;
    }): Promise<{
        status: HttpStatus;
        success: boolean;
        data: import("./entities/media.entity").Media[];
        message: string;
    }>;
}
