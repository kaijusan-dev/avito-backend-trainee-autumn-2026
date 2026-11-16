import prisma from '../../database/prisma.js';
import { HttpError } from '../../../../shared/src/errors/http.errors.js';
import * as restaurantService from '../restaurant/restaurant.service.js';
import type { CreatePlatformOrder, OrderStatus } from './orders.types.js';

export const createOrderFromPlatform = async (data: CreatePlatformOrder) => {
    // MVP: id заказа в restaurant-api = platformOrderId. Даёт идемпотентность
    // и не требует отдельного поля в схеме.
    const existing = await prisma.order.findUnique({
        where: { id: data.platformOrderId },
        include: { items: true },
    });

    if (existing) {
        return existing;
    }

    const restaurant = await restaurantService.getRestaurant();

    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true, isAvailable: true },
    });

    const productsMap = new Map(products.map((p) => [p.id, p]));

    const orderItems = data.items.map((item) => {
        const product = productsMap.get(item.productId);

        if (!product) {
            throw new HttpError(
                'ProductNotFoundError',
                `Товар ${item.productId} не найден`,
                400,
                'VALIDATION_ERROR',
            );
        }

        if (!product.isAvailable) {
            throw new HttpError(
                'ProductUnavailableError',
                `Товар "${product.name}" недоступен`,
                409,
                'CONFLICT',
            );
        }

        return {
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: item.quantity,
        };
    });

    const totalPrice = orderItems.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
    );

    return prisma.order.create({
        data: {
            id: data.platformOrderId,
            restaurantId: restaurant.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            fulfillmentType: data.fulfillmentType,
            deliveryAddress: data.deliveryAddress ?? null,
            totalPrice,
            items: { create: orderItems },
        },
        include: { items: true },
    });
};

export const listOrders = async (status?: OrderStatus) => {
    return prisma.order.findMany({
        where: status ? { status } : {},
        include: { items: true },
        orderBy: { createdAt: 'desc' },
    });
};

export const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!order) {
        throw new HttpError(
            'OrderNotFoundError',
            'Заказ не найден',
            404,
            'ITEM_NOT_FOUND',
        );
    }

    return order;
};

export const updateOrderStatus = async (id: string, status: string) => {
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
        throw new HttpError(
            'OrderNotFoundError',
            'Заказ не найден',
            404,
            'ITEM_NOT_FOUND',
        );
    }

    if (order.status === 'COMPLETED' || order.status === 'REJECTED') {
        throw new HttpError(
            'OrderNotModifiableError',
            'Заказ уже завершён и не может быть изменён',
            409,
            'CONFLICT',
        );
    }

    return prisma.order.update({
        where: { id },
        data: { status: status as never },
        include: { items: true },
    });
};