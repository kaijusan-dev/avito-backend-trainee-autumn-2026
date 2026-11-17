import { z } from 'zod';

export const ProductParamsSchema = z.object({
    id: z.uuid(),
});

export const ProductLookupSchema = z.object({
    productIds: z.array(z.uuid()).min(1).max(200),
});

export const UpdateProductSchema = z.object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
    price: z.number().int().min(0).optional(),
    isAvailable: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'Нужно передать хотя бы одно поле' });

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;