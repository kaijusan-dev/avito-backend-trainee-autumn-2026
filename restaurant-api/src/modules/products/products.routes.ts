import express from 'express';
import * as productsController from './products.controller.js';

export const productsRouter = express.Router();

productsRouter.post('/lookup', productsController.lookupProducts);
productsRouter.patch('/:id', productsController.updateProduct);