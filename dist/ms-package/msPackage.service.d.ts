import { MsPackageRepository } from './repositories/msPackage.repository';
import { CreateMsPackageDto } from './dto/create-ms-package.dto';
import { UpdateMsPackageDto } from './dto/update-ms-package.dto';
import { MsPackage } from './entities/msPackage.entity';
export declare class MsPackageService {
    private readonly msPackageRepo;
    constructor(msPackageRepo: MsPackageRepository);
    create(createMsPackageDto: CreateMsPackageDto): Promise<MsPackage>;
    findAll(): Promise<MsPackage[]>;
    findOne(id: number): Promise<MsPackage | null>;
    update(id: number, updateMsPackageDto: UpdateMsPackageDto): Promise<MsPackage>;
    remove(id: number): Promise<boolean>;
}
