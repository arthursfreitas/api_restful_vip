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
  async show(req: Request, res: Response) {
    const repository = getRepository(Product)
    const { product_code } = req.params
    const product = await repository.findOne({ product_code })

    if (!product) {
      return res.status(404).json({ error: `Produto não encontrado!` })
    }
    return res.status(200).json(product)
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
      return res.status(201).json(saveProduct)
    } catch (error) {
      console.log(error.message)
      return res.status(400).json({ message: `Erro ao cadastrar produto!` })
    }
  }
  async update(req: Request, res: Response) {
    try {
      const repository = getRepository(Product)
      const { product_code } = req.params
      const { name, color, size, price, quantity } = req.body
      const productExists = await repository.findOne(product_code)
      if (!productExists) {
        return res.status(400).json({ error: `Produto não encontrado!` })
      }
      const product = repository.create({ name, color, size, price, quantity })
      await repository.update(product_code, product)
      return res.sendStatus(200)
    } catch (error) {
      console.log(error.message)
      return res.json({ message: `Erro ao atualizar produto!` })
    }
  }
  async destroy(req: Request, res: Response) {
    try {
      const repository = getRepository(Product)
      const { product_code } = req.params
      const productExists = await repository.findOne(product_code)
      if (!productExists) {
        return res.status(400).json({ error: `Produto não encontrado!` })
      }
      await repository.softRemove(productExists)
      return res.sendStatus(200)
    } catch (error) {
      console.log(error.message)
      return res.json({ message: `Erro ao excluir produto!` })
    }
  }
}

export default new ProductController()
