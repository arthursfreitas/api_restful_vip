import { IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export default class Produtos {
  @PrimaryGeneratedColumn('uuid', { name: 'codigo_produto' })
  codigo_produto: string

  @Column({ type: 'text', nullable: false })
  @IsString()
  @IsNotEmpty()
  nome: string

  @Column({ type: 'text', nullable: false })
  @IsString()
  @IsNotEmpty()
  cor: string

  @Column({ type: 'text', nullable: false })
  @IsString()
  @IsNotEmpty()
  tamanho: string

  @Column({ type: 'text', nullable: false })
  @IsNotEmpty()
  valor: string

  @CreateDateColumn({ name: 'created_At' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_At' })
  updatedAt: Date
}
