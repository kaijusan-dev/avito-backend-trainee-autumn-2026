import express from 'express';
import * as ordersController from './orders.controller.js';

export const ordersRouter = express.Router();

ordersRouter.post('/', ordersController.createOrder);
ordersRouter.get('/', ordersController.listOrders);
ordersRouter.get('/:id', ordersController.getOrder);
ordersRouter.patch('/:id/status', ordersController.updateOrderStatus);