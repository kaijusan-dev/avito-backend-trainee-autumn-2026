import { type Request, type Response } from 'express';
import * as restaurantService from './restaurant.service.js';

export const getRestaurant = async (_req: Request, res: Response) => {
    const restaurant = await restaurantService.getRestaurant();
    res.status(200).json(restaurant);
};