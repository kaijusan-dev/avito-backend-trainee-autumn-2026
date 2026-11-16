import app from './app.js';
import { checkPrismaStatus } from './database/prisma.js';
import { env } from '../../shared/src/config/env.js';
import { logger } from '../../shared/src/config/logger.js';
import { seedDatabase } from './database/seed.js';

const startApp = async () => {

  try {
    const isDbConnected = await checkPrismaStatus();

    if (!isDbConnected) {
      throw new Error('База данных недоступна');
    }

    if (env.NODE_ENV === 'test') {
      await seedDatabase();
    }

    const port = Number(env.RESTAURANT_API_PORT) || 3001;

    app.listen(port, () => {
      logger.info({ port }, 'Restaurant API запущен');
    });

  } catch (error) {
    logger.fatal({ err: error }, "Критическая ошибка при запуске приложения");
  
    process.exit(1);
  }
};

startApp().catch((error: unknown) => {
  logger.fatal({ err: error }, "Необработанная ошибка запуска");

  process.exit(1);
});