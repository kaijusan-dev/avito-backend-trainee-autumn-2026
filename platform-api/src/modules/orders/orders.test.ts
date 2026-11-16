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

    test('GET /orders/:id', async () => {
        const order = await prisma.order.create({
            data: {
                restaurantId,
                customerName: 'Иван',
                customerPhone: '+79001234567',
                fulfillmentType: 'PICKUP',
                totalPrice: 90000,
                items: {
                    create: [{
                        productId: randomUUID(),
                        productName: 'Маргарита',
                        unitPrice: 45000,
                        quantity: 2,
                    }],
                },
            },
        });

        const response = await request(app)
            .get(`/orders/${order.id}`)
            .expect(200);

        expect(response.body.id).toBe(order.id);
        expect(response.body.items).toHaveLength(1);
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