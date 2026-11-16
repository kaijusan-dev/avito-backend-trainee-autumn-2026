import express from 'express';
import * as restaurantsController from './restaurants.controller.js';

export const restaurantsRouter = express.Router();

restaurantsRouter.get('/', restaurantsController.getRestaurants);
restaurantsRouter.get('/:id', restaurantsController.getRestaurant);
restaurantsRouter.get('/:id/menu', restaurantsController.getRestaurantMenu);