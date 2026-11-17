import 'express-async-errors';
import express from 'express';
import { restaurantRouter } from './modules/restaurant/restaurant.routes.js';
import { menuRouter } from './modules/menu/menu.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';
import { errorMiddleware } from '../../shared/src/middleware/error.middleware.js';
import { setupDocs } from '../../shared/src/docs/openapi.js';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();

app.use(express.json());

app.use('/menu', menuRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

// CJM со стороны заведения
app.use('/restaurant', restaurantRouter);

const here = dirname(fileURLToPath(import.meta.url));
setupDocs(app, resolve(here, '../docs/openapi.yaml'));

// фикс бесконечного запроса иконки
app.get('/favicon.ico', (_req, res) => res.status(204).end());

app.use(errorMiddleware);

export default app;