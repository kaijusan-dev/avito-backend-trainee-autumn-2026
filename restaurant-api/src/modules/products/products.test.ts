import { describe, test, expect, beforeEach } from 'vitest';
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

describe('endpoints /products', () => {
    beforeEach(async () => {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.restaurant.deleteMany();

        const product = await setupProduct();
        productId = product.id;
    });

    test('POST /products/lookup', async () => {
        const response = await request(app)
            .post('/products/lookup')
            .send({ productIds: [productId] })
            .expect(200);

        expect(response.body.products).toHaveLength(1);
        expect(response.body.products[0].id).toBe(productId);
    });

    test('POST /products/lookup - пустой массив', async () => {
        const response = await request(app)
            .post('/products/lookup')
            .send({ productIds: [] })
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    test('POST /products/lookup - нет такого товара', async () => {
        const response = await request(app)
            .post('/products/lookup')
            .send({ productIds: ['00000000-0000-4000-8000-000000000000'] })
            .expect(200);

        expect(response.body.products).toEqual([]);
    });

    test('PATCH /products/:id - isAvailable', async () => {
        const response = await request(app)
            .patch(`/products/${productId}`)
            .send({ isAvailable: false })
            .expect(200);

        expect(response.body.isAvailable).toBe(false);
    });

    test('PATCH /products/:id - price', async () => {
        const response = await request(app)
            .patch(`/products/${productId}`)
            .send({ price: 50000 })
            .expect(200);

        expect(response.body.price).toBe(50000);
    });

    test('PATCH /products/:id - не найдено', async () => {
        const response = await request(app)
            .patch('/products/00000000-0000-4000-8000-000000000000')
            .send({ isAvailable: false })
            .expect(404);

        expect(response.body.code).toBe('ITEM_NOT_FOUND');
    });

    test('PATCH /products/:id - пустое тело', async () => {
        const response = await request(app)
            .patch(`/products/${productId}`)
            .send({})
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });
});