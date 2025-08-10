import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  collectionName: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  extension: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  directory: string;

  @Column()
  disk: string;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
