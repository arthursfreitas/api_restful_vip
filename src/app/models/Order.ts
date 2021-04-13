import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import PaymentType from '../enums/PaymentType'

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
}
export default Order
