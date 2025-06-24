import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

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
