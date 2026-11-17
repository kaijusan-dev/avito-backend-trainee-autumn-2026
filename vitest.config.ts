import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {

    // Включаем полную изоляцию сред для каждого файла тестов
    isolate: true,

    // Отключаем параллельный запуск разных файлов тестов
    fileParallelism: false, 
    
    // Ограничиваем количество потоков до одного
    maxWorkers: 1,

    // Отключаем параллельный запуск тестов внутри самих файлов
    sequence: {
      concurrent: false,
    },
    env: {
      NODE_ENV: 'test',
      PLATFORM_DATABASE_URL:
          'postgresql://postgres:postgres@localhost:2222/platform_db_test?schema=public',
      RESTAURANT_DATABASE_URL:
          'postgresql://postgres:postgres@localhost:3333/restaurant_db_test?schema=public',
      RESTAURANT_SERVICE_URL: 'http://localhost:3001',
    },
  },
});
