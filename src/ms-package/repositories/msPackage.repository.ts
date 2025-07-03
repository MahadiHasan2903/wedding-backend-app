import { DataSource, Repository } from 'typeorm';
import { MsPackage } from '../entities/msPackage.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MsPackageRepository extends Repository<MsPackage> {
  constructor(private dataSource: DataSource) {
    super(MsPackage, dataSource.createEntityManager());
  }
}
