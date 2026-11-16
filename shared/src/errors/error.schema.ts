import { z } from "zod";

export const ERROR_CODES = [
    'PATH_NOT_FOUND',
    'VALIDATION_ERROR',
    'CONFLICT',
    'INTERNAL_SERVER_ERROR',
    'ITEM_NOT_FOUND',
    'SERVICE_UNAVAILABLE'
] as const;

export type ErrorCode = typeof ERROR_CODES[number];

export const ErrorResponseSchema = z.object({
    success: z.literal(false),
    status: z.coerce.number(),
    code: z.enum(ERROR_CODES),
    message: z.string(),
    timestamp: z.string().datetime(),
    stack: z.string().optional(), 
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;