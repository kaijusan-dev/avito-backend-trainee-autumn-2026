import { z } from 'zod';

export const MenuQuerySchema = z.object({
    includeUnavailable: z
        .union([z.literal('true'), z.literal('false')])
        .optional()
        .transform((v) => v === 'true'),
});

export type MenuQuery = z.infer<typeof MenuQuerySchema>;