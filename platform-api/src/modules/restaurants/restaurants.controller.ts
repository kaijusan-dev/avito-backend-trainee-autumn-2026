import { type Request, type Response } from 'express';
import * as restaurantsService from './restaurants.service.js';
import { RestaurantParamsSchema } from './restaurants.types.js';
import { BadRequestError } from '../../../../shared/src/errors/http.errors.js';

export const getRestaurants = async (_req: Request, res: Response) => {
    const restaurants = await restaurantsService.getRestaurants();

    res.status(200).json(restaurants);
};

export const getRestaurant = async (req: Request, res: Response) => {
    const parsedParams = RestaurantParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    const restaurant = await restaurantsService.getRestaurantById(parsedParams.data.id);

    res.status(200).json(restaurant);
};

export const getRestaurantMenu = async (req: Request, res: Response) => {
    const parsedParams = RestaurantParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    const menu = await restaurantsService.getMenu(parsedParams.data.id);

    res.status(200).json(menu);
};