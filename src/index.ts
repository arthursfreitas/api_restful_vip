import dotenv from 'dotenv'
import 'reflect-metadata'
import './database/connect'
import express from 'express'
import routes from './routes'
import path from 'path'

dotenv.config()

const app = express()
app.use('/public', express.static(path.resolve('./public')))

app.use(express.json())
app.use(routes)

app.listen(8000, () =>
  console.log(`🔥 Server started at http://localhost:8000`)
)
