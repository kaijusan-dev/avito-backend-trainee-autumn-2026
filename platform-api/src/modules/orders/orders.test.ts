import { describe, test, expect, beforeEach } from 'vitest';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import prisma from '../../database/prisma.js';
import { app } from '../../app.js';

const createRestaurant = async () => {
    return prisma.restaurant.create({
        data: { name: 'Пиццерия', address: 'адрес', isActive: true },
    });
};

const buildOrder = (restaurantId: string, overrides = {}) => ({
    restaurantId,
    customerName: 'Иван',
    customerPhone: '+79001234567',
    fulfillmentType: 'PICKUP' as const,
    items: [{ productId: randomUUID(), quantity: 2 }],
    ...overrides,
});

describe('endpoints /orders', () => {
    let restaurantId: string;

    beforeEach(async () => {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.restaurant.deleteMany();

        const restaurant = await createRestaurant();
        restaurantId = restaurant.id;
    });

    test('POST /orders - ресторан не найден', async () => {
        const response = await request(app)
            .post('/orders')
            .send(buildOrder(randomUUID()))
            .expect(404);

        expect(response.body.code).toBe('ITEM_NOT_FOUND');
    });

    test('POST /orders - DELIVERY без адреса', async () => {
        const response = await request(app)
            .post('/orders')
            .send(buildOrder(restaurantId, { fulfillmentType: 'DELIVERY' }))
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    test('POST /orders - пустой items', async () => {
        const response = await request(app)
            .post('/orders')
            .send(buildOrder(restaurantId, { items: [] }))
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    test('POST /orders - quantity = 0', async () => {
        const response = await request(app)
            .post('/orders')
            .send(buildOrder(restaurantId, {
                items: [{ productId: randomUUID(), quantity: 0 }],
            }))
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    test('POST /orders - пустое тело', async () => {
        const response = await request(app).post('/orders').send({}).expect(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    test('создание заказа и получение актуального статуса', async () => {
        // доступные товары из Restaurant API
        const menuResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/menu`);

        expect(menuResponse.status).toBe(200);

        const menu = await menuResponse.json() as never[];

        const product = menu
            .flatMap((category: { products: { id: string }[] }) => category.products)
            .find((product: { id: string }) => product.id);

        expect(product).toBeDefined();

        // создать ресторан в Platform DB
        const restaurant = await prisma.restaurant.create({
            data: {
                name: 'Пиццерия',
                address: 'Тестовый адрес',
                isActive: true,
            },
        });

        // делаем заказ через Platform API
        const createResponse = await request(app)
            .post('/orders')
            .send({
                restaurantId: restaurant.id,
                customerName: 'Иван',
                customerPhone: '+79001234567',
                fulfillmentType: 'PICKUP',
                items: [
                    {
                        productId: product!.id,
                        quantity: 2,
                    },
                ],
            })
            .expect(201);

        const orderId = createResponse.body.id;

        // изменить статус заказа через Restaurant API
        const updateResponse = await fetch(
            `${process.env.RESTAURANT_SERVICE_URL}/orders/${orderId}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'PREPARING',
                }),
            },
        );

        expect(updateResponse.status).toBe(200);

        // получение заказа через Platform API
        const getResponse = await request(app)
            .get(`/orders/${orderId}`)
            .expect(200);

        expect(getResponse.body.id).toBe(orderId);
        expect(getResponse.body.status).toBe('PREPARING');
    });

    test('GET /orders/:id - не найдено', async () => {
        const response = await request(app)
            .get('/orders/00000000-0000-4000-8000-000000000000')
            .expect(404);

        expect(response.body.code).toBe('ITEM_NOT_FOUND');
    });

    test('GET /orders/:id - невалидный UUID', async () => {
        const response = await request(app).get('/orders/not-a-uuid').expect(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
    });
});