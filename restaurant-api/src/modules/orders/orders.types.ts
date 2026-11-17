import { z } from 'zod';

export const OrderParamsSchema = z.object({
    id: z.uuid(),
});

export const PlatformOrderItemSchema = z.object({
    productId: z.uuid(),
    quantity: z.number().int().min(1).max(100),
});

export const CreatePlatformOrderSchema = z.object({
    platformOrderId: z.uuid(),
    customerName: z.string().trim().min(1).max(100),
    customerPhone: z.string().trim().min(5).max(30),
    fulfillmentType: z.enum(['DELIVERY', 'PICKUP']),
    deliveryAddress: z.string().trim().min(1).max(300).nullable().optional(),
    items: z.array(PlatformOrderItemSchema).min(1),
});

export const ListOrdersQuerySchema = z.object({
    status: z.enum([
        'PENDING',
        'CONFIRMED',
        'REJECTED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'OUT_FOR_DELIVERY',
        'COMPLETED',
    ]).optional(),
});

export const UpdateOrderStatusSchema = z.object({
    status: z.enum([
        'CONFIRMED',
        'REJECTED',
        'PREPARING',
        'READY_FOR_PICKUP',
        'OUT_FOR_DELIVERY',
        'COMPLETED',
    ]),
});

export type CreatePlatformOrder = z.infer<typeof CreatePlatformOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;
export type OrderStatus = z.infer<typeof ListOrdersQuerySchema>['status'];