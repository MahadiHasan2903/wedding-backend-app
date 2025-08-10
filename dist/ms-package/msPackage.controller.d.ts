import { HttpStatus } from '@nestjs/common';
import { CreateMsPackageDto } from './dto/create-ms-package.dto';
import { UpdateMsPackageDto } from './dto/update-ms-package.dto';
import { MsPackageService } from './msPackage.service';
export declare class MsPackageController {
    private readonly msPackageService;
    constructor(msPackageService: MsPackageService);
    getAll(): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/msPackage.entity").MsPackage[];
    }>;
    getOneById(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/msPackage.entity").MsPackage | null;
    }>;
    create(createMsPackageDto: CreateMsPackageDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/msPackage.entity").MsPackage;
    }>;
    update(id: string, updateMsPackageDto: UpdateMsPackageDto): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: import("./entities/msPackage.entity").MsPackage;
    }>;
    remove(id: string): Promise<{
        status: HttpStatus;
        success: boolean;
        message: string;
        data: {};
    }>;
}
