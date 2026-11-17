import { describe, test, expect, beforeEach } from 'vitest';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import prisma from '../../database/prisma.js';
import app from '../../app.js';

let productId: string;

const setupProduct = async () => {
    const restaurant = await prisma.restaurant.create({
        data: { name: 'Пиццерия', address: 'адрес' },
    });
    const category = await prisma.category.create({
        data: { name: 'Пицца', restaurantId: restaurant.id },
    });
    return prisma.product.create({
        data: { categoryId: category.id, name: 'Маргарита', price: 45000, isAvailable: true },
    });
};

const buildOrder = (overrides = {}) => ({
    platformOrderId: randomUUID(),
    customerName: 'Иван',
    customerPhone: '+79001234567',
    fulfillmentType: 'PICKUP',
    items: [{ productId, quantity: 2 }],
    ...overrides,
});

// функция чтобы создать заказ через API
const createOrder = async (overrides = {}) => {
    const body = buildOrder(overrides);
    await request(app).post('/orders').send(body).expect(201);
    return body;
};

describe('endpoints /orders', () => {
    beforeEach(async () => {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.restaurant.deleteMany();

        const product = await setupProduct();
        productId = product.id;
    });

    test('POST /orders', async () => {
        const body = buildOrder();

        const response = await request(app)
            .post('/orders')
            .send(body)
            .expect(201);

        expect(response.body.id).toBe(body.platformOrderId);
        expect(response.body.totalPrice).toBe(90000);
        expect(response.body.status).toBe('PENDING');
    });

    test('POST /orders - идемпотентно', async () => {
        const body = buildOrder();

        await request(app).post('/orders').send(body).expect(201);
        const second = await request(app).post('/orders').send(body).expect(201);

        expect(second.body.id).toBe(body.platformOrderId);
    });

    test('POST /orders - товар недоступен', async () => {
        await prisma.product.update({
            where: { id: productId },
            data: { isAvailable: false },
        });

        const response = await request(app)
            .post('/orders')
            .send(buildOrder())
            .expect(409);

        expect(response.body.code).toBe('CONFLICT');
    });

    test('POST /orders - товар не найден', async () => {
        const response = await request(app)
            .post('/orders')
            .send(buildOrder({
                items: [{ productId: '00000000-0000-4000-8000-000000000000', quantity: 1 }],
            }))
            .expect(400);

        expect(response.body.code).toBe('ITEM_NOT_FOUND');
    });

    test('GET /orders', async () => {
        await createOrder();

        const response = await request(app).get('/orders').expect(200);

        expect(response.body).toHaveLength(1);
    });

    test('GET /orders?status=PENDING', async () => {
        await createOrder();

        const pending = await request(app).get('/orders?status=PENDING').expect(200);
        expect(pending.body).toHaveLength(1);

        const completed = await request(app).get('/orders?status=COMPLETED').expect(200);
        expect(completed.body).toEqual([]);
    });

    test('GET /orders/:id', async () => {
        const body = await createOrder();

        const response = await request(app)
            .get(`/orders/${body.platformOrderId}`)
            .expect(200);

        expect(response.body.id).toBe(body.platformOrderId);
    });

    test('GET /orders/:id - не найдено', async () => {
        const response = await request(app)
            .get('/orders/00000000-0000-4000-8000-000000000000')
            .expect(404);

        expect(response.body.code).toBe('ITEM_NOT_FOUND');
    });

    test('PATCH /orders/:id/status', async () => {
        const body = await createOrder();

        const response = await request(app)
            .patch(`/orders/${body.platformOrderId}/status`)
            .send({ status: 'CONFIRMED' })
            .expect(200);

        expect(response.body.status).toBe('CONFIRMED');
    });

    test('PATCH /orders/:id/status - после COMPLETED нельзя менять', async () => {
        const body = await createOrder();

        await request(app)
            .patch(`/orders/${body.platformOrderId}/status`)
            .send({ status: 'COMPLETED' })
            .expect(200);

        const response = await request(app)
            .patch(`/orders/${body.platformOrderId}/status`)
            .send({ status: 'CONFIRMED' })
            .expect(409);

        expect(response.body.code).toBe('CONFLICT');
    });

    test('PATCH /orders/:id/status - невалидный статус', async () => {
        const body = await createOrder();

        const response = await request(app)
            .patch(`/orders/${body.platformOrderId}/status`)
            .send({ status: 'INVALID' })
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });
});