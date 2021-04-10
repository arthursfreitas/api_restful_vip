import { Router } from 'express'
import userRouter from './user.route'

const routes = Router()

routes.get('/', (_, res) => {
  res.json({ doc: 'API Express with Typescript and TypeORM' })
})

routes.use('/api/v1/user', userRouter)

export default routes
