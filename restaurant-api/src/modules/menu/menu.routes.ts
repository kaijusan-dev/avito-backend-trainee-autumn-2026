import express from 'express';
import * as menuController from './menu.controller.js';

export const menuRouter = express.Router();

menuRouter.get('/', menuController.getMenu);