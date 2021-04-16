import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Client from '../models/Client'

class ClientController {
  async index(req: Request, res: Response) {
    const repository = getRepository(Client)
    const clients = await repository.find()
    return res.json(clients)
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
      console.log(`Error message: ${error.message}`)
      return res.sendStatus(400)
    }
  }
}
export default new ClientController()
