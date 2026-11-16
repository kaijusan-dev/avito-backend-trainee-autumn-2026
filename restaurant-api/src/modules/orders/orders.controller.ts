import { type Request, type Response } from 'express';
import * as ordersService from './orders.service.js';
import {
    CreatePlatformOrderSchema,
    ListOrdersQuerySchema,
    OrderParamsSchema,
    UpdateOrderStatusSchema,
} from './orders.types.js';
import { BadRequestError } from '../../../../shared/src/errors/http.errors.js';

export const createOrder = async (req: Request, res: Response) => {
    const parsed = CreatePlatformOrderSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError();

    const order = await ordersService.createOrderFromPlatform(parsed.data);
    res.status(201).json(order);
};

export const listOrders = async (req: Request, res: Response) => {
    const parsed = ListOrdersQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new BadRequestError();

    const orders = await ordersService.listOrders(parsed.data.status);
    res.status(200).json(orders);
};

export const getOrder = async (req: Request, res: Response) => {
    const parsed = OrderParamsSchema.safeParse(req.params);
    if (!parsed.success) throw new BadRequestError();

    const order = await ordersService.getOrderById(parsed.data.id);
    res.status(200).json(order);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const parsedParams = OrderParamsSchema.safeParse(req.params);
    const parsedBody = UpdateOrderStatusSchema.safeParse(req.body);

    if (!parsedParams.success || !parsedBody.success) throw new BadRequestError();

    const order = await ordersService.updateOrderStatus(
        parsedParams.data.id,
        parsedBody.data.status,
    );
    res.status(200).json(order);
};