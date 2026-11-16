import express from 'express';
import * as restaurantController from './restaurant.controller.js';

export const restaurantRouter = express.Router();

restaurantRouter.get('/', restaurantController.getRestaurant);