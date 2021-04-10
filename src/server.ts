import dotenv from 'dotenv'
import app from './app'
import 'reflect-metadata'
import './database'

dotenv.config()

const PORT = 8000

const server = app.listen(PORT, () => {
  console.log(`⚡[server] running in port ${PORT}!`)
})

process.on('SIGINT', () => {
  server.close()
  console.log('⛔[server] closed!')
})
