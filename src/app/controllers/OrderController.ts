import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import PaymentType from '../enums/PaymentType'
import Order from '../models/Order'
import OrderItem from '../models/OrderItem'
import Product from '../models/Product'

export interface IOrder {
  note: string
  payment_type: PaymentType
  client: IClient
  products: IProduct[]
}
export interface IProduct {
  product_code: string
  quantity: number
}
export interface IClient {
  name: string
  cpf: string
  gender: string
  email: string
}

class OrderController {
  async index(req: Request, res: Response) {
    const repository = getRepository(Order)
    const orders = await repository.find()
    return res.status(200).json(orders)
  }
  async store(req: Request, res: Response) {
    try {
      const orderRepository = getRepository(Order)
      const orderItemRepository = getRepository(OrderItem)
      const productsRepository = getRepository(Product)

      const { note, payment_type, client, products } = req.body as IOrder

      products.map(async product => {
        return await productsRepository
          .findOne(product.product_code)
          .then(prod => {
            if (!prod) {
              return res.status(400).json({ error: `Produto não cadastrado!` })
            }
          })
      })

      const order = orderRepository.create({
        note,
        payment_type,
        client,
      })

      const orderErrors = await validate(order)
      if (orderErrors.length > 0) {
        return res.status(400).json(orderErrors)
      }
      await orderRepository.save(order)

      const results = products.map((product: any) => {
        return orderItemRepository.create({
          order_code: order.order_code,
          product_code: product.product_code,
          quantity: product.quantity,
        })
      })

      results.map(async (result: any) => {
        await orderItemRepository.save({
          product_code: result.product_code,
          order_code: result.order_code,
          quantity: result.quantity,
        })
      })

      return res.status(200).json({
        order,
        results,
      })
    } catch (error) {
      console.log(`Error message: ${error.message}`)
      return res.json({ error: 'Erro ao criar pedido!' })
    }
  }
}

export default new OrderController()
