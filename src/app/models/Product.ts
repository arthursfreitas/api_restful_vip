import { IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
export default Product
