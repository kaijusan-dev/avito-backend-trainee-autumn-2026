# avito-backend-trainee-autumn-2026

**avito-backend-trainee-autumn-2026** - это backend-проект на TypeScript / NodeJS + Express, тестовое задание от Авито для выполнения КТ2 по предмету "Основы ИТ-технологий"

## Dev Команды

Запуск форматирования файлов .prisma:

```bash
npx prisma format --config platform-api/prisma.config.ts
npx prisma format --config restaurant-api/prisma.config.ts
```

Запуск проверки валидности моделей prisma:

```bash
npx prisma validate --config platform-api/prisma.config.ts
npx prisma validate --config restaurant-api/prisma.config.ts
```

Запуск генерации клиента prisma для обоих сервисов:

```bash
npm run db:generate
```

Запуск миграции prisma для сервисов:

```bash
npm run db:migrate:platform -- --name название_миграции
npm run db:migrate:restaurant -- --name название_миграции
```
