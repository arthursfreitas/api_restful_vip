import { Router } from 'express'
import ClientController from './app/controllers/ClientController'
import OrderController from './app/controllers/OrderController'
import ProductController from './app/controllers/ProductController'

const router = Router()
// Clients
router.get('/clients', ClientController.index)
router.get('/clients/:client_code', ClientController.show)
router.post('/clients', ClientController.store)
router.put('/clients/:client_code', ClientController.update)
router.delete('/clients/:client_code', ClientController.destroy)

// Products
router.get('/products', ProductController.index)
router.get('/products/:product_code', ProductController.show)
router.post('/products', ProductController.store)
router.put('/products/:product_code', ProductController.update)
router.delete('/products/:product_code', ProductController.destroy)

// Orders
router.get('/orders', OrderController.index)
router.get('/orders/:order_code', OrderController.show)
router.post('/orders', OrderController.store)
router.put('/orders/:order_code', OrderController.update)
router.delete('/orders/:order_code', OrderController.destroy)
router.post('/orders/:order_code/sendmail', OrderController.sendMail)
router.post('/orders/:order_code/report', OrderController.exportPdf)
export default router
