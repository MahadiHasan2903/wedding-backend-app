import { DataSource, Repository } from 'typeorm';
import { MsPackage } from '../entities/msPackage.entity';

export class MsPackageRepository extends Repository<MsPackage> {
  constructor(private dataSource: DataSource) {
    super(MsPackage, dataSource.createEntityManager());
  }
}
