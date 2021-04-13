import dotenv from 'dotenv'
import 'reflect-metadata'
import './database/connect'
import express from 'express'
import routes from './routes'

dotenv.config()

const app = express()

app.use(express.json())
app.use(routes)

app.listen(8000, () =>
  console.log(`🔥 Server started at http://localhost:8000`)
)
