import { z } from 'zod';

export const RestaurantSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    address: z.string(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;