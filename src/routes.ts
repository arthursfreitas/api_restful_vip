import { Router } from 'express'
import ClientController from './app/controllers/ClientController'
import OrderController from './app/controllers/OrderController'
import ProductController from './app/controllers/ProductController'

const router = Router()
// Clients
router.get('/clients', ClientController.index)
router.post('/clients', ClientController.store)

// Products
router.get('/products', ProductController.index)
router.post('/products', ProductController.store)

// Orders

router.get('/orders', OrderController.index)
router.post('/orders', OrderController.store)
export default router
