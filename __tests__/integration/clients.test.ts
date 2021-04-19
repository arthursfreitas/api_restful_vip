import request from 'supertest'
import { createConnections } from 'typeorm'
import { app } from '../../src'

beforeAll(async () => {
  await createConnections()
})

const client = {
  name: 'Arthur Freitas',
  cpf: Math.random(),
  gender: 'M',
  email: 'arthurssfreitas@gmail.com',
}
test('should be return all clients', async () => {
  const response = await request(app).get('/clients')
  expect(response.status).toBe(200)
})

test('should be possible to create a new client', async () => {
  const response = await request(app).post('/clients').send(client)
  expect(response.status).toBe(201)
})
