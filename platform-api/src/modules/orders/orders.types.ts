import { z } from 'zod';

export const OrderParamsSchema = z.object({
    id: z.uuid(),
});

export const CreateOrderSchema = z.object({
    restaurantId: z.uuid(),
    customerName: z.string().trim().min(1).max(100),
    customerPhone: z.string().trim().min(5).max(30),
    fulfillmentType: z.enum(['DELIVERY', 'PICKUP']),
    deliveryAddress: z.string().trim().min(1).max(300).optional(),
    items: z
        .array(
            z.object({
                productId: z.uuid(),
                quantity: z.number().int().min(1).max(100),
            }),
        )
        .min(1),
}).refine(
    (data) => data.fulfillmentType !== 'DELIVERY' || !!data.deliveryAddress,
    {
        message: 'Для доставки необходимо указать адрес',
        path: ['deliveryAddress'],
    },
);

export type CreateOrder = z.infer<typeof CreateOrderSchema>;