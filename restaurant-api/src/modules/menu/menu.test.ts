import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import prisma from '../../database/prisma.js';
import app from '../../app.js';

const setupMenu = async () => {
    const restaurant = await prisma.restaurant.create({
        data: { name: 'Пиццерия', address: 'г. Пермь, ул. Ленина, 1' },
    });
    const pizza = await prisma.category.create({
        data: { name: 'Пицца', restaurantId: restaurant.id },
    });
    await prisma.product.createMany({
        data: [
            { categoryId: pizza.id, name: 'Маргарита', price: 45000, isAvailable: true },
            { categoryId: pizza.id, name: 'Пепперони', price: 55000, isAvailable: false },
        ],
    });
};

describe('endpoints /menu', () => {
    beforeEach(async () => {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.restaurant.deleteMany();

        await setupMenu();
    });

    test('GET /menu - только доступные', async () => {
        const response = await request(app).get('/menu').expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('Пицца');
        expect(response.body[0].products).toHaveLength(1);
        expect(response.body[0].products[0].name).toBe('Маргарита');
    });

    test('GET /menu?includeUnavailable=true', async () => {
        const response = await request(app)
            .get('/menu?includeUnavailable=true')
            .expect(200);

        expect(response.body[0].products).toHaveLength(2);
    });

    test('GET /menu - невалидный query', async () => {
        const response = await request(app)
            .get('/menu?includeUnavailable=maybe')
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });
});