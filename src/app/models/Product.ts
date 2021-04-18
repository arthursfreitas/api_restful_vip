import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import OrderItem from './OrderItem'

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  product_code: string

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string

  @Column()
  @IsString()
  color: string

  @Column()
  @IsNotEmpty()
  @IsString()
  size: string

  @Column()
  @IsNotEmpty()
  @IsString()
  price: string

  @Column()
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => OrderItem, order_item => order_item.product, {
    cascade: true,
  })
  order_item: OrderItem

  @DeleteDateColumn()
  deleted_at?: Date
}
export default Product
