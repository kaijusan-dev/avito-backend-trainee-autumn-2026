import { HttpError } from '../../../../shared/src/errors/http.errors.js';
import { env } from '../../../../shared/src/config/env.js';
import prisma from '../../database/prisma.js';

export const getRestaurants = async () => {
    return prisma.restaurant.findMany({
        where: { isActive: true },
        select: {
            id: true,
            name: true,
            address: true,
        },
        orderBy: { name: 'asc' },
    });
};

export const getRestaurantById = async (id: string) => {
    const restaurant = await prisma.restaurant.findFirst({
        where: { id, isActive: true },
        select: {
            id: true,
            name: true,
            address: true,
        },
    });

    if (!restaurant) {
        throw new HttpError(
            'RestaurantNotFoundError',
            'Заведение не найдено',
            404,
            'ITEM_NOT_FOUND',
        );
    }

    return restaurant;
};

export const getMenu = async (id: string) => {
    // проверка, что заведение существует и активно
    await getRestaurantById(id);

    let response: Response;

    try {
        response = await fetch(new URL('/menu', env.RESTAURANT_SERVICE_URL), {
            signal: AbortSignal.timeout(5000),
        });
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
            'Не удалось получить меню заведения',
            502,
            'SERVICE_UNAVAILABLE',
        );
    }

    return response.json();
};