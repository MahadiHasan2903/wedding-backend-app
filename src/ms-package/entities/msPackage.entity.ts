import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PackageStatus, PriceOptionType } from '../enum/msPackage.enum';

export class PriceOption {
  category: PriceOptionType;
  originalPrice: number;
  sellPrice: number;
}

@Entity('membership_packages')
export class MsPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.ACTIVE,
  })
  status: PackageStatus;

  @Column('json')
  priceOptions: PriceOption[];
}
