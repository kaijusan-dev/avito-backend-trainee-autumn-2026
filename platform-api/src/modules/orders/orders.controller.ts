import { type Request, type Response } from 'express';
import * as ordersService from './orders.service.js';
import { CreateOrderSchema, OrderParamsSchema } from './orders.types.js';
import { BadRequestError } from '../../../../shared/src/errors/http.errors.js';

export const createOrder = async (req: Request, res: Response) => {
    const parsedBody = CreateOrderSchema.safeParse(req.body);

    if (!parsedBody.success) throw new BadRequestError();

    const order = await ordersService.createOrder(parsedBody.data);

    res.status(201).json(order);
};

export const getOrder = async (req: Request, res: Response) => {
    const parsedParams = OrderParamsSchema.safeParse(req.params);

    if (!parsedParams.success) throw new BadRequestError();

    const order = await ordersService.getOrderById(parsedParams.data.id);

    res.status(200).json(order);
};