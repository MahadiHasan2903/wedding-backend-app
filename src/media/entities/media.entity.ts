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

  @OneToOne(() => User, (user) => user.profilePicture, {
    nullable: true,
  })
  @JoinColumn({ name: 'profilePictureOwnerId' })
  userProfilePicture: User;

  @ManyToOne(() => User, (user) => user.additionalPhotos, {
    nullable: true,
  })
  @JoinColumn({ name: 'albumOwnerId' })
  userAdditionalPhotos: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
