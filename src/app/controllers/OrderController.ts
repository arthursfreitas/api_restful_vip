import { validate } from 'class-validator'
import { Request, Response } from 'express'
import pdf from 'html-pdf'
import { getRepository } from 'typeorm'
import PaymentType from '../enums/PaymentType'
import { dataSendMail } from '../helpers/mail'
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
  async show(req: Request, res: Response) {
    const repository = getRepository(Order)
    const { order_code } = req.params
    const order = await repository.findOne({ order_code })
    if (!order) {
      return res.status(404).json({ error: `Pedido não encontrado!` })
    }
    return res.status(200).json(order)
  }

  async update(req: Request, res: Response) {
    const repository = getRepository(Order)
    const { order_code } = req.params
    const { note, payment_type } = req.body
    const orderExists = await repository.findOne({ order_code })
    if (!orderExists) {
      return res.status(404).json({ error: `Pedido não encontrado!` })
    }

    await repository.update(order_code, {
      note,
      payment_type,
    })

    return res.status(200).json({ message: 'Pedido atualizado com sucesso!' })
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
              return res.status(404).json({ error: `Produto não cadastrado!` })
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

      return res.status(201).json({
        order,
        results,
      })
    } catch (error) {
      console.log(`Error message: ${error.message}`)
      return res.json({ error: 'Erro ao criar pedido!' })
    }
  }

  async destroy(req: Request, res: Response) {
    try {
      const orderRepository = getRepository(Order)
      const orderItemRepository = getRepository(OrderItem)

      const { order_code } = req.params
      const order_item = await orderItemRepository.find({
        select: ['item_order_code'],
        where: [{ order_code: order_code }],
      })

      if (!order_item) {
        return res
          .status(404)
          .json({ error: `Itens do pedido não encontrado!` })
      }

      await orderItemRepository.remove(order_item)
      const order = await orderRepository.findOne({ order_code })
      if (!order) {
        return res.status(404).json({ error: `Pedido não encontrado!` })
      }
      await orderRepository.remove(order)
      return res.sendStatus(200)
    } catch (error) {
      console.log(error.message)
      return res.json({ message: `Erro ao excluir pedido!` })
    }
  }

  private static async getOrderDetails(order_code: string) {
    const orderItemRepository = getRepository(OrderItem)

    const data = await orderItemRepository.query(`
    SELECT clients.name, clients.email, products.name, products.price, order_item.quantity,
    orders.payment_type, orders.created_at
    FROM order_item
    INNER JOIN orders ON orders.order_code = '${order_code}'  
    INNER JOIN clients ON clients.client_code = orders.clientClientCode
    INNER JOIN products ON products.product_code = order_item.product_code
    WHERE order_item.order_code = '${order_code}'`)

    const totalPerProduct = await data.map((product: any) => {
      const totalProduct = parseFloat(product.price) * product.quantity
      return totalProduct
    })

    const totalOrder = await totalPerProduct.reduce((acc: any, total: any) => {
      return acc + total
    })
    return {
      data,
      totalOrder,
    }
  }

  async sendMail(req: Request, res: Response) {
    try {
      const { order_code } = req.params
      const order = await OrderController.getOrderDetails(order_code)

      const uniqueItems = order.data
        .filter((orders: any) => orders)
        .map((res: any) => {
          return {
            email: res.email,
            created_at: res.created_at,
            payment_type: res.payment_type,
          }
        })[0]

      const formattedDate = uniqueItems.created_at.toLocaleDateString('pt-BR')

      const emailSent = await dataSendMail(
        [uniqueItems.email],
        `Pedido - ${order_code}`,
        '',
        `<html>
      <body>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      body{
        margin:0px;
        font-family:'Poppins';
      }
      span {
        font-weight: bold;
      }
      .wrapper{
        padding:30px;
      }
      ul{
        list-style:none;
      }
      header{
        width: auto;
        margin-left: calc(50% - 50vw);
        align-items: center;
        justify-content: center;
        display: flex;
        margin-right: calc(50% - 50vw);
        height: 150px;
        background-color: #0271bc;
      }
      header h1{
        text-transform:uppercase;
        color:#fff;
      }
      </style>
      
      <header>
        <h1>Relatório do pedido</h1>
      </header>
      <div class="wrapper">
          <div>
          <h1>Dados do pedido:</h1>
            <ul>
            <li><span>Email: </span>${uniqueItems.email}</li>
            <li><span>Data do pedido: </span>${formattedDate}</li>
            <li><span>Forma de pagamento: </span>${
              uniqueItems.payment_type
            }</li>
            </ul>
          </div>
          <div>
            <h2>Produtos:</h2>
            <ul>
            ${order.data
              .map((product: any) => {
                const totalProduct =
                  parseFloat(product.price) * product.quantity

                return `<li>
              <span>Nome: </span>${product.name}</li>
              <li><span>Preço: </span>R$${product.price}</li>
              <li><span>Quantidade: </span>${product.quantity}</li>
              <li><span>SubTotal: </span>R$${totalProduct}</li>
              <hr>
              `
              })
              .join('')}
            </ul>
          </div>
          <div>
            <ul>
            <li><strong>Total: </strong>R$${order.totalOrder}</li>
            </ul>
          </div>
        </div>
      </body>
    </html>`
      )

      return res
        .status(200)
        .json({ message: `Email enviado para: ${emailSent.envelope.to}` })
    } catch (error) {
      console.log(error.message)
      return res.json({ message: `Erro ao enviar email!` })
    }
  }

  async exportPdf(req: Request, res: Response) {
    try {
      const { order_code } = req.params
      const order = await OrderController.getOrderDetails(order_code)

      const uniqueItems = order.data
        .filter((orders: any) => orders)
        .map((res: any) => {
          return {
            email: res.email,
            created_at: res.created_at,
            payment_type: res.payment_type,
          }
        })[0]

      const formattedDate = uniqueItems.created_at.toLocaleDateString('pt-BR')
      let pdfContent = `<html>
      <body>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      body{
        margin:0px;
        font-family:'Poppins';
      }
      span {
        font-weight: bold;
      }
      .wrapper{
        padding:30px;
      }
      ul{
        list-style:none;
      }
      header{
        width: auto;
        margin-left: calc(50% - 50vw);
        align-items: center;
        justify-content: center;
        display: flex;
        margin-right: calc(50% - 50vw);
        height: 150px;
        background-color: #0271bc;
      }
      header h1{
        text-transform:uppercase;
        color:#fff;
      }
      </style>
      
      <header>
        <h1>Relatório do pedido</h1>
      </header>
      <div class="wrapper">
          <div>
          <h1>Dados do pedido:</h1>
            <ul>
            <li><span>Email: </span>${uniqueItems.email}</li>
            <li><span>Data do pedido: </span>${formattedDate}</li>
            <li><span>Forma de pagamento: </span>${
              uniqueItems.payment_type
            }</li>
            </ul>
          </div>
          <div>
            <h2>Produtos:</h2>
            <ul>
            ${order.data
              .map((product: any) => {
                const totalProduct =
                  parseFloat(product.price) * product.quantity

                return `<li>
              <span>Nome: </span>${product.name}</li>
              <li><span>Preço: </span>R$${product.price}</li>
              <li><span>Quantidade: </span>${product.quantity}</li>
              <li><span>SubTotal: </span>R$${totalProduct}</li>
              <hr>
              `
              })
              .join('')}
            </ul>
          </div>
          <div>
            <ul>
            <li><strong>Total: </strong>R$${order.totalOrder}</li>
            </ul>
          </div>
        </div>
      </body>
    </html>`

      pdf
        .create(pdfContent, {})
        .toFile(`public/docs/${order_code}.pdf`, (error, response) => {
          if (error) {
            console.log(`Erro ao exportar PDF: ${error}`)
          } else {
            return res.status(200).download(`public/docs/${order_code}.pdf`)
          }
        })
    } catch (error) {
      console.log(error.message)
      return res.json({ message: `Erro ao exportar PDF!` })
    }
  }
}

export default new OrderController()
