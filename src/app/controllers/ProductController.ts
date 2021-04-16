import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Product from '../models/Product'

class ProductController {
  async index(req: Request, res: Response) {
    const repository = getRepository(Product)
    const products = await repository.find()
    return res.json(products)
  }
  async store(req: Request, res: Response) {
    try {
      const repository = getRepository(Product)
      const { name, color, size, price, quantity } = req.body
      const product = repository.create({ name, color, size, price, quantity })
      const productExists = await repository.findOne({ name })

      if (productExists) {
        return res.status(400).json({ error: `Produto ${name} já cadastrado!` })
      }

      const errors = await validate(product)
      if (errors.length > 0) {
        return res.status(400).json(errors)
      }
      const saveProduct = await repository.save(product)
      return res.status(200).json(saveProduct)
    } catch (error) {
      console.log(`Error message: ${error.message}`)
      return res.sendStatus(400)
    }
  }
}

export default new ProductController()
