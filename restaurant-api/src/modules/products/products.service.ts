import prisma from '../../database/prisma.js';
import { HttpError } from '../../../../shared/src/errors/http.errors.js';
import type { UpdateProduct } from './products.types.js';

export const lookupProducts = async (productIds: string[]) => {
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: {
            id: true,
            name: true,
            price: true,
            isAvailable: true,
        },
    });

    return { products };
};

export const updateProduct = async (id: string, data: UpdateProduct) => {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        throw new HttpError(
            'ProductNotFoundError',
            'Товар не найден',
            404,
            'ITEM_NOT_FOUND',
        );
    }

    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    );

    return prisma.product.update({
        where: { id },
        data: cleanData,
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            isAvailable: true,
        },
    });
};