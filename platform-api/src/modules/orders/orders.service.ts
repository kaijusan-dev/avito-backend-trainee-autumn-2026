import { HttpError } from '../../../../shared/src/errors/http.errors.js';
import { env } from '../../../../shared/src/config/env.js';
import prisma from '../../database/prisma.js';
import * as restaurantsService from '../restaurants/restaurants.service.js';
import type { CreateOrder } from './orders.types.js';

type RemoteProduct = {
    id: string;
    name: string;
    price: number;
    isAvailable: boolean;
};

async function requestRestaurant(
    path: string,
    init?: RequestInit,
) {
    let response: Response;

    try {
        response = await fetch(
            new URL(path, env.RESTAURANT_SERVICE_URL),
            {
                ...init,
                signal: AbortSignal.timeout(5000),
            },
        );
    } catch {
        throw new HttpError(
            'RestaurantServiceError',
            'Сервис заведения недоступен',
            502,
            'SERVICE_UNAVAILABLE',
        );
    }

    if (!response.ok) {
        throw new HttpError(
            'RestaurantServiceError',
            'Ошибка при взаимодействии с сервисом заведения',
            502,
            'SERVICE_UNAVAILABLE',
        );
    }

    return response;
}

export const createOrder = async (data: CreateOrder) => {
    // проверка, что заведение существует и активно
    const restaurant = await restaurantsService.getRestaurantById(data.restaurantId);

    // актуальные цены и наличие товаров.
    const lookupResponse = await requestRestaurant(
        '/products/lookup',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productIds: [...new Set(data.items.map((item) => item.productId))],
            }),
        },
    );

    const lookup = (await lookupResponse.json()) as { products: RemoteProduct[] };

    const products = new Map(
        lookup.products.map((product) => [product.id, product]),
    );

    const orderItems = data.items.map((item) => {
        const product = products.get(item.productId);

        if (!product) {
            throw new HttpError(
                'ProductNotFoundError',
                `Товар ${item.productId} не найден`,
                400,
                'ITEM_NOT_FOUND',
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

        if (!Number.isSafeInteger(product.price) || product.price < 0) {
            throw new HttpError(
                'InvalidProductPriceError',
                'Сервис заведения вернул некорректную цену',
                502,
                'SERVICE_UNAVAILABLE',
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

    if (!Number.isSafeInteger(totalPrice)) {
        throw new HttpError(
            'OrderPriceError',
            'Слишком большая сумма заказа',
            400,
            'VALIDATION_ERROR',
        );
    }

    // сохранение заказа на платформе
    const order = await prisma.order.create({
        data: {
            restaurantId: restaurant.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            fulfillmentType: data.fulfillmentType,
            deliveryAddress:
                data.fulfillmentType === 'DELIVERY'
                    ? (data.deliveryAddress ?? null)
                    : null,
            totalPrice,
            items: {
                create: orderItems,
            },
        },
        include: {
            items: true,
        },
    });

    // передача заказа заведению
    await requestRestaurant('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            platformOrderId: order.id,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            fulfillmentType: data.fulfillmentType,
            deliveryAddress:
                data.fulfillmentType === 'DELIVERY'
                    ? (data.deliveryAddress ?? null)
                    : null,
            items: orderItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
        }),
    });
    
    return order;
};


export const getOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: true,
            restaurant: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                },
            },
        },
    });

    if (!order) {
        throw new HttpError(
            'OrderNotFoundError',
            'Заказ не найден',
            404,
            'ITEM_NOT_FOUND',
        );
    }

    // актуальный статус
    const response = await requestRestaurant(
        `/orders/${encodeURIComponent(id)}`,
    );

    const restaurantOrder = (await response.json()) as {
        status: string;
    };

    return {
        ...order,
        status: restaurantOrder.status,
    };
};
