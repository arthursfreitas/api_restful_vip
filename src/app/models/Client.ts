import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('clients')
class Client {
  @PrimaryGeneratedColumn('uuid')
  client_code: string

  @Column()
  @IsString()
  name: string

  @Column()
  @IsNotEmpty()
  cpf: string

  @Column()
  gender: string

  @Column()
  @IsEmail()
  email: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
export default Client
