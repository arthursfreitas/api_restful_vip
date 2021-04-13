import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt, { Secret } from 'jsonwebtoken'
import User from '../models/User'

interface IUser {
  id: string
  email: string
  password?: string
}

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User)
    const { email, password } = req.body

    const user: IUser | undefined = await repository.findOne({
      where: { email },
    })

    if (!user) {
      return res.sendStatus(401)
    }

    const isValidPassword = await bcrypt.compare(
      password as string,
      user.password as string
    )

    if (!isValidPassword) {
      return res.sendStatus(401)
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET as Secret, {
      expiresIn: '1d',
    })

    delete user.password

    return res.json({
      user,
      token,
    })
  }
}
export default new AuthController()
