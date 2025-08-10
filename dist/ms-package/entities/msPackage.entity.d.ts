import { PackageStatus, CategoryInfoType } from '../enum/msPackage.enum';
export declare class CategoryInfo {
    category: CategoryInfoType;
    originalPrice: number;
    sellPrice: number;
}
export declare class MsPackage {
    id: number;
    title: string;
    description: string[];
    status: PackageStatus;
    categoryInfo: CategoryInfo;
}
