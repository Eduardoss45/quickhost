import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date', nullable: true })
  birth_date?: Date;

  @Column({ length: 20, nullable: true })
  phone_number?: string;

  @Column({ length: 150, unique: true })
  username: string = '';

  @Column({ length: 255, unique: true })
  email: string = '';

  @Column({ length: 150, nullable: true })
  social_name?: string;

  @Column({ nullable: true })
  profile_picture_url?: string;

  @Column({ length: 11, nullable: true })
  cpf?: string;

  @Column({ select: false })
  password: string = '';

  @CreateDateColumn()
  created_at!: Date;
}
