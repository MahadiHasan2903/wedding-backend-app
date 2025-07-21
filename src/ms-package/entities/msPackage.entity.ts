import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PackageStatus, CategoryInfoType } from '../enum/msPackage.enum';

export class CategoryInfo {
  category: CategoryInfoType;
  originalPrice: number;
  sellPrice: number;
}

@Entity('membership_packages')
export class MsPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('json')
  description: string[];

  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.ACTIVE,
  })
  status: PackageStatus;

  @Column('json')
  categoryInfo: CategoryInfo;
}
