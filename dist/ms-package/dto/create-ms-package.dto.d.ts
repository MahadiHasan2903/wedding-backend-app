import { PackageStatus, CategoryInfoType } from '../enum/msPackage.enum';
declare class CategoryInfoDto {
    category: CategoryInfoType;
    originalPrice: number;
    sellPrice: number;
}
export declare class CreateMsPackageDto {
    title: string;
    description: string[];
    status?: PackageStatus;
    categoryInfo: CategoryInfoDto;
}
export {};
