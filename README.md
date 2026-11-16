# avito-backend-trainee-autumn-2026

**avito-backend-trainee-autumn-2026** - это backend-проект на TypeScript / NodeJS + Express, тестовое задание от Авито для выполнения КТ2 по предмету "Основы ИТ-технологий"

## Prisma

Форматирование схем:

```bash
npx prisma format --config platform-api/prisma.config.ts
npx prisma format --config restaurant-api/prisma.config.ts
```

Валидация схем:

```bash
npx prisma validate --config platform-api/prisma.config.ts
npx prisma validate --config restaurant-api/prisma.config.ts
```

Генерация клиента (оба сервиса):

```bash
npm run db:generate
```

Новая миграция:

```bash
npm run db:migrate:platform -- --name название_миграции
npm run db:migrate:restaurant -- --name название_миграции
```

## Тестовые БД

Создать:

```bash
docker exec platform-db psql -U postgres -c "CREATE DATABASE platform_db_test;"
docker exec restaurant-db psql -U postgres -c "CREATE DATABASE restaurant_db_test;"
```

Накатить миграции на тестовые БД:

```bash
npm run db:migrate:test
```

По отдельности:

```bash
npm run db:migrate:test:platform
npm run db:migrate:test:restaurant
```

## Тесты

```bash
npm run test
npm run test:watch
npm run test:platform
npm run test:restaurant
```

## Запуск локально

В разных терминалах:

```bash
npm run dev:platform
npm run dev:restaurant
```

## Сборка и запуск собранного

```bash
npm run build
npm run start:platform
npm run start:restaurant
```