import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Client from '../models/Client'
import Order from '../models/Order'
import OrderItem from '../models/OrderItem'

class ClientController {
  async index(req: Request, res: Response) {
    const repository = getRepository(Client)
    const clients = await repository.find()
    return res.json(clients)
  }

  async show(req: Request, res: Response) {
    const repository = getRepository(Client)
    const { client_code } = req.params
    const client = await repository.findOne({ client_code })
    if (!client) {
      return res.status(404).json({ error: `Cliente não encontrado!` })
    }
    return res.status(200).json(client)
  }

  async store(req: Request, res: Response) {
    try {
      const repository = getRepository(Client)
      const { name, cpf, gender, email } = req.body

      const clientExists = await repository.findOne({ where: { cpf } })

      if (clientExists) {
        return res.status(400).json({ error: `CPF ${cpf} já cadastrado!` })
      }
      const client = repository.create({ name, cpf, gender, email })
      const errors = await validate(client)
      if (errors.length > 0) {
        return res.status(400).json(errors)
      }
      await repository.save(client)
      return res.json(client)
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ message: `Erro ao cadastrar cliente!` })
    }
  }
  async update(req: Request, res: Response) {
    try {
      const repository = getRepository(Client)
      const { client_code } = req.params
      const { name, email, cpf, gender } = req.body
      const clientExists = await repository.findOne({ cpf })
      if (clientExists) {
        return res.status(404).json({ error: `CPF já cadastrado!` })
      }

      const client = repository.create({
        name,
        cpf,
        email,
        gender,
      })

      const errors = await validate(client)
      if (errors.length > 0) {
        return res.status(400).json(errors)
      }

      await repository.update(client_code, client)

      return res
        .status(200)
        .json({ message: 'Cliente atualizado com sucesso!' })
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ message: `Erro ao atualizar cliente!` })
    }
  }
  async destroy(req: Request, res: Response) {
    try {
      const clientRepository = getRepository(Client)
      const orderRepository = getRepository(Order)
      const orderItemRepository = getRepository(OrderItem)
      const { client_code } = req.params
      const client = await clientRepository.findOne({ client_code })

      const clientOrders = await orderRepository.find({
        select: ['order_code'],
        where: [{ client: client_code }],
      })
      if (!client) {
        return res.status(404).json({ error: `Cliente não encontrado!` })
      }
      clientOrders.map(async order => {
        const order_item = await orderItemRepository.find({
          select: ['item_order_code'],
          where: [{ order_code: order.order_code }],
        })
        await orderItemRepository.remove(order_item)
        await orderRepository.remove(clientOrders).then(async () => {
          await clientRepository.remove(client)
        })
      })

      return res.sendStatus(200)
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ message: `Erro ao excluir cliente!` })
    }
  }
}
export default new ClientController()
