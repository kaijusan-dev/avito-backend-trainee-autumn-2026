import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import prisma from '../../database/prisma.js';
import { app } from '../../app.js';

const createRestaurant = async (name = 'Пиццерия', isActive = true) => {
    return prisma.restaurant.create({
        data: { name, address: 'г. Пермь, ул. Ленина, 1', isActive },
    });
};

describe('endpoints /restaurants', () => {
    beforeEach(async () => {
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.restaurant.deleteMany();
    });

    test('GET /restaurants', async () => {
        await createRestaurant('A');
        await createRestaurant('B');

        const response = await request(app).get('/restaurants').expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0].name).toBe('A');
    });

    test('GET /restaurants - только активные', async () => {
        await createRestaurant('A', true);
        await createRestaurant('B', false);

        const response = await request(app).get('/restaurants').expect(200);

        expect(response.body).toHaveLength(1);
    });

    test('GET /restaurants - пусто', async () => {
        const response = await request(app).get('/restaurants').expect(200);
        expect(response.body).toEqual([]);
    });

    test('GET /restaurants/:id', async () => {
        const restaurant = await createRestaurant();

        const response = await request(app)
            .get(`/restaurants/${restaurant.id}`)
            .expect(200);

        expect(response.body.id).toBe(restaurant.id);
        expect(response.body.name).toBe('Пиццерия');
    });

    test('GET /restaurants/:id - не найдено', async () => {
        const response = await request(app)
            .get('/restaurants/00000000-0000-4000-8000-000000000000')
            .expect(404);

        expect(response.body.code).toBe('ITEM_NOT_FOUND');
    });

    test('GET /restaurants/:id - невалидный UUID', async () => {
        const response = await request(app)
            .get('/restaurants/not-a-uuid')
            .expect(400);

        expect(response.body.code).toBe('VALIDATION_ERROR');
    });
});