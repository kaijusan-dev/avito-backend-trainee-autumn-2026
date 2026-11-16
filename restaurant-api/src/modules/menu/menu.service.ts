import prisma from '../../database/prisma.js';

export const getMenu = async (includeUnavailable = false) => {
    return prisma.category.findMany({
        select: {
            id: true,
            name: true,
            products: {
                where: includeUnavailable ? {} : { isAvailable: true },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    isAvailable: true,
                },
                orderBy: { name: 'asc' },
            },
        },
        orderBy: { name: 'asc' },
    });
};