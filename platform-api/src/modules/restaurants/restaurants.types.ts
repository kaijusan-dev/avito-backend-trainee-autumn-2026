import { z } from 'zod';

export const RestaurantParamsSchema = z.object({
    id: z.uuid(),
});

export const RestaurantSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    address: z.string(),
});

export const RestaurantListItemSchema = RestaurantSchema.pick({
    id: true,
    name: true,
    address: true,
});

export type Restaurant = z.infer<typeof RestaurantSchema>;
export type RestaurantListItem = z.infer<typeof RestaurantListItemSchema>;