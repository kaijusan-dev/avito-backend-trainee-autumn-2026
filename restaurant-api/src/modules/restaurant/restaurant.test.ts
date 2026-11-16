import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import prisma from '../../database/prisma.js';
import app from '../../app.js';

describe('endpoints /restaurant', () => {
    beforeEach(async () => {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.restaurant.deleteMany();

        await prisma.restaurant.create({
            data: { name: 'Пиццерия', address: 'г. Пермь, ул. Ленина, 1' },
        });
    });

    test('GET /restaurant', async () => {
        const response = await request(app).get('/restaurant').expect(200);

        expect(response.body.name).toBe('Пиццерия');
        expect(response.body.address).toBe('г. Пермь, ул. Ленина, 1');
        expect(response.body.id).toBeDefined();
    });

    test('GET /restaurant - не настроено', async () => {
        await prisma.restaurant.deleteMany();

        const response = await request(app).get('/restaurant').expect(404);

        expect(response.body.code).toBe('SERVICE_UNAVAILABLE');
    });
});