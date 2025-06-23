import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PriceOptionType } from '../enum/msPackage.enum';

export class PriceOption {
  category: PriceOptionType;
  originalPrice: number;
  sellPrice: number;
}

@Entity()
export class MsPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('json')
  priceOptions: PriceOption[];
}
