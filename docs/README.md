
# Avito.Kitchen

**Avito.Kitchen** - backend-проект на Node.js, Express и TypeScript, разработанный в рамках тестового задания Avito Backend Trainee Autumn 2026 для выполнения КТ2 по дисциплине «Основы ИТ-технологий».

Проект представляет собой backend-платформу для оформления и обработки заказов заведений. Система состоит из двух независимых REST API: Platform API и Restaurant API.

## Основные возможности

- Получение списка заведений и информации о них.
- Просмотр меню выбранного заведения.
- Оформление заказов с самовывозом или доставкой.
- Проверка существования, доступности и актуальной стоимости товаров.
- Передача заказов от платформы в систему заведения.
- Управление товарами и их доступностью.
- Получение списка заказов и информации об отдельных заказах.
- Изменение статусов заказов.
- Получение клиентом актуального статуса заказа через Platform API.

Оплата заказов и пользовательская авторизация в рамках MVP не реализуются.

## Стек технологий

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **API Documentation:** OpenAPI, Scalar
- **Testing:** Vitest
- **DevOps:** Docker, Docker Compose
- **CI:** GitHub Actions

## Архитектура

Проект разделён на два самостоятельных сервиса:

| Сервис | Ответственность |
|---|---|
| Platform API | Взаимодействие с клиентом, оформление заказов, получение информации о заказах |
| Restaurant API | Управление заведением и товарами, получение заказов и изменение их статусов |

Каждый сервис использует собственную базу данных PostgreSQL. Взаимодействие между сервисами осуществляется через HTTP REST API.

**Restaurant API является источником актуального статуса заказа.** При запросе заказа Platform API получает основные данные из своей базы и дополнительно запрашивает актуальный статус у Restaurant API.

Общий исходный код находится в директории `shared/` и используется обоими сервисами.

## Структура проекта

```text
.
├── platform-api/
│   ├── docs/           # OpenAPI-спецификация
│   ├── prisma/         # Схема и миграции Platform DB
│   └── src/            # Исходный код Platform API
│
├── restaurant-api/
│   ├── docs/           # OpenAPI-спецификация
│   ├── prisma/         # Схема и миграции Restaurant DB
│   └── src/             # Исходный код Restaurant API
│
├── shared/              # Общие компоненты
├── docs/
│   ├── cjm/             # Customer Journey Map
│   └── architecture/    # C4-диаграммы
│
├── .github/
│   └── workflows/       # GitHub Actions
│
├── docker-compose.yml
├── package.json
└── README.md
```

## Документация

Документация проекта разделена на описание пользовательских сценариев, архитектуры и API.

### Пользовательские сценарии (CJM)

- [Со стороны клиента](cjm/customer.md)
- [Со стороны заведения](cjm/restaurant.md)

### Архитектура (C4)

- [Уровень 1 - System Context](architecture/c4-context.md)
- [Уровень 2 - Container Diagram](architecture/c4-container.md)

### API

Для описания REST API используются OpenAPI-спецификации и Scalar.

- **Platform API:** `platform-api/docs/openapi.yaml`
- **Restaurant API:** `restaurant-api/docs/openapi.yaml`

После запуска соответствующего сервиса документация доступна по адресу `/docs`.

## Настройка проекта

Для запуска проекта необходимо установить Docker, Docker Compose и Node.js.

Установите зависимости:

```bash
npm install
```

Создайте файл `.env` на основе `.env.example`

При необходимости настройте переменные окружения, включая адреса подключения к обеим базам данных и URL Restaurant API.

## Запуск проекта

### Через Docker Compose

Сборка и запуск всех сервисов:

```bash
docker compose up --build -d
```

Проверить состояние контейнеров:

```bash
docker compose ps
```

Посмотреть логи:

```bash
docker compose logs -f
```

Остановить сервисы:

```bash
docker compose down
```

### Локально

Для локального запуска сначала необходимо запустить PostgreSQL и применить миграции.

Затем в отдельных терминалах запустите сервисы:

```bash
npm run dev:platform
```

```bash
npm run dev:restaurant
```

## Работа с Prisma

В проекте используются две независимые Prisma-схемы: для Platform API и Restaurant API.

### Форматирование схем

```bash
npx prisma format --config platform-api/prisma.config.ts
npx prisma format --config restaurant-api/prisma.config.ts
```

### Валидация схем

```bash
npx prisma validate --config platform-api/prisma.config.ts
npx prisma validate --config restaurant-api/prisma.config.ts
```

### Генерация Prisma Client

Для обоих сервисов:

```bash
npm run db:generate
```

### Создание миграций

Для Platform API:

```bash
npm run db:migrate:platform -- --name название_миграции
```

Для Restaurant API:

```bash
npm run db:migrate:restaurant -- --name название_миграции
```

## Тестирование

В проекте используется vitest + supertest

Запуск всех тестов:

```bash
npm run test
```

Запуск в режиме наблюдения:

```bash
npm run test:watch
```

Запуск тестов отдельных сервисов:

```bash
npm run test:platform
npm run test:restaurant
```

### Тестовые базы данных

Создание тестовых баз данных:

```bash
docker exec platform-db psql -U postgres -c "CREATE DATABASE platform_db_test;"
docker exec restaurant-db psql -U postgres -c "CREATE DATABASE restaurant_db_test;"
```

Применение миграций к тестовым базам:

```bash
npm run db:migrate:test
```

При необходимости миграции можно применить отдельно:

```bash
npm run db:migrate:test:platform
npm run db:migrate:test:restaurant
```

## Сборка и запуск

Сборка проекта:

```bash
npm run build
```

Запуск Platform API:

```bash
npm run start:platform
```

Запуск Restaurant API:

```bash
npm run start:restaurant
```

## CI

Для автоматической проверки проекта используется GitHub Actions.

При push и создании pull request выполняются:

1. Установка зависимостей.
2. Генерация Prisma Client.
3. Подготовка тестовых баз данных и применение миграций.
4. Запуск тестов.
5. Сборка проекта.

Для тестирования в CI используются отдельные экземпляры PostgreSQL для Platform API и Restaurant API.
