import { validate } from 'class-validator'
import { Router, Request, Response } from 'express'
import { getCustomRepository, getRepository } from 'typeorm'
import UserRepository from '../repositories/user.repository'
import User from '../models/user.model'

const userRouter = Router()

userRouter.post('/', async (request: Request, response: Response) => {
  try {
    const repo = getRepository(User)
    const customRepo = getCustomRepository(UserRepository)
    const { name, email } = request.body

    const user = repo.create({
      name,
      email,
    })

    const userFinded = await customRepo.getUserByEmail(email)

    if (userFinded) {
      return response
        .status(404)
        .json({ error: `Email ${userFinded.email} já cadastrado` })
    }

    const errors = await validate(user)

    if (errors.length === 0) {
      const res = await repo.save(user)
      return response.status(201).json(res)
    }
    return response.status(400).json(errors)
  } catch (error) {
    console.log(`error.message: ${error.message}`)
    return response.status(400).send()
  }
})

userRouter.get('/', async (req, res) => {
  const users = await getRepository(User).find()
  return res.json(users)
})

export default userRouter
