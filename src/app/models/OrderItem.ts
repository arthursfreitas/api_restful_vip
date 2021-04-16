import { IsNotEmpty, IsNumber } from 'class-validator'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Order from './Order'
import Product from './Product'

@Entity('order_item')
class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  item_order_code: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_code' })
  order: Order

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_code' })
  product: Product

  @Column()
  product_code: string

  @Column()
  order_code: string

  @Column('integer')
  @IsNotEmpty()
  @IsNumber()
  quantity: number
}
export default OrderItem
