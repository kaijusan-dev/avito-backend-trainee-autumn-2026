import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { env } from "../../../shared/src/config/env.js";
import { logger } from "../../../shared/src/config/logger.js";

// const connectionString = env.RESTAURANT_DATABASE_URL || (
//   process.env.VITEST === 'true' 
//     ? env.DATABASE_URL_TEST 
//     : env.DATABASE_URL
// );

const connectionString = env.PLATFORM_DATABASE_URL;

const pool = new Pool({
  connectionString
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const checkPrismaStatus = async () => {
  try {
    // простой запрос к базе для проверки работоспособности
    await prisma.$queryRaw`SELECT 1`;

    logger.info('Успешное подключение к базе данных через Prisma');

    return true;

  } catch (error) {
    logger.error({ err: error }, 'Ошибка подключения к базе данных через Prisma');

    return false;
  }
}

export default prisma;
