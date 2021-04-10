import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string

  @Column()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @CreateDateColumn({ name: 'created_At' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_At' })
  updatedAt: Date
}
