import { IsDateString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PAYMENT_TYPE } from '../enums/payment-type.enum'

export default class Pedidos {
  @PrimaryGeneratedColumn('uuid', { name: 'codigo_pedido' })
  codigo_pedido: string

  @CreateDateColumn()
  @IsDateString()
  data_pedido: Date

  @Column({ nullable: true, type: 'text' })
  observacao: string

  @Column({ type: 'enum', enum: PAYMENT_TYPE, nullable: false })
  forma_de_pagamento: PAYMENT_TYPE

  @UpdateDateColumn({ name: 'updated_At' })
  updatedAt: Date
}
