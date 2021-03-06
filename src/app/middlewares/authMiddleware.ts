import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
interface ITokenPayload {
  id: string
  iat: number
  exp: number
}
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers
  if (!authorization) {
    return res.sendStatus(401)
  }
  const token = authorization.replace('Bearer', '').trim()
  try {
    const data = jwt.verify(token, process.env.SECRET as Secret)
    const { id } = data as ITokenPayload
    req.userId = id
    return next()
  } catch {
    return res.sendStatus(401)
  }
}
