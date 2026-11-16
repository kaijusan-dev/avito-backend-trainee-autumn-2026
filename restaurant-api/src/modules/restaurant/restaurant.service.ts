import prisma from '../../database/prisma.js';
import { HttpError } from '../../../../shared/src/errors/http.errors.js';

export const getRestaurant = async () => {
    const restaurant = await prisma.restaurant.findFirst({
        select: { id: true, name: true, address: true },
    });

    if (!restaurant) {
        throw new HttpError(
            'RestaurantNotFoundError',
            'Заведение не настроено',
            404,
            'SERVICE_UNAVAILABLE',
        );
    }

    return restaurant;
};