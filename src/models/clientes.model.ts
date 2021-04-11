import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export default class Clientes {
  @PrimaryGeneratedColumn('uuid', { name: 'codigo_cliente' })
  codigo_cliente: string

  @Column({ type: 'text', nullable: false })
  @IsString()
  @IsNotEmpty()
  nome: string

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  @IsString()
  cpf: string

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  @IsString()
  sexo: string

  @Column({ type: 'text', nullable: false })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @CreateDateColumn({ name: 'created_At' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_At' })
  updatedAt: Date
}
