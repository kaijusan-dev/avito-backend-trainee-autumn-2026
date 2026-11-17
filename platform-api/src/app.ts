import 'express-async-errors';
import express, { type Request, type Response } from 'express';
import { restaurantsRouter } from './modules/restaurants/restaurants.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';
import { httpLogger } from '../../shared/src/middleware/http-logger.middleware.js';
import { PathNotFoundError } from '../../shared/src/errors/http.errors.js';
import { errorMiddleware } from '../../shared/src/middleware/error.middleware.js';
import { setupDocs } from '../../shared/src/docs/openapi.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const app = express();

app.use(express.json())

app.use(httpLogger);

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);

const here = dirname(fileURLToPath(import.meta.url));
setupDocs(app, resolve(here, '../docs/openapi.yaml'));

// фикс бесконечного запроса иконки
app.get('/favicon.ico', (_req, res) => res.status(204).end());

// для несуществующих путей
app.use((req) => {
	throw new PathNotFoundError(req.originalUrl);
});

app.use(errorMiddleware);	