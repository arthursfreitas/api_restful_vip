import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import PaymentType from '../enums/PaymentType'
import Client from './Client'
import OrderItem from './OrderItem'
import Product from './Product'

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  order_code: string

  @Column()
  note: string

  @Column({ type: 'enum', enum: PaymentType })
  payment_type: PaymentType

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Client)
  client: Client

  @OneToMany(() => OrderItem, order_item => order_item.order, { cascade: true })
  order_item: OrderItem[]
}
export default Order
