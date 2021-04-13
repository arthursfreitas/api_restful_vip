import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('clients')
class User {
  @PrimaryGeneratedColumn('uuid')
  client_code: string

  @Column()
  @IsString()
  name: string

  @Column()
  @IsNotEmpty()
  cpf: string

  @Column()
  sexo: string

  @Column()
  @IsEmail()
  email: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
export default User
