import 'dotenv/config'
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(3000),
    PLATFORM_API_PORT: z.coerce.number().int().positive().default(3000),
    RESTAURANT_API_PORT: z.coerce.number().int().positive().default(3001),
    PLATFORM_DB_PORT: z.coerce.number().int().positive().default(1111),
    RESTAURANT_DB_PORT: z.coerce.number().int().positive().default(1112),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PLATFORM_DATABASE_URL: z.string(),
    RESTAURANT_DATABASE_URL: z.string(),
    RESTAURANT_SERVICE_URL: z.string().url().default('http://localhost:3001'),
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid or missing environment variables:');
  const treeError = _env.error.format();
  console.log(JSON.stringify(treeError, null, 2));
  process.exit(1);
}

export const env = _env.data;