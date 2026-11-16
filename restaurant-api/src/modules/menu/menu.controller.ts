import { type Request, type Response } from 'express';
import * as menuService from './menu.service.js';
import { MenuQuerySchema } from './menu.types.js';
import { BadRequestError } from '../../../../shared/src/errors/http.errors.js';

export const getMenu = async (req: Request, res: Response) => {
    const parsed = MenuQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new BadRequestError();

    const menu = await menuService.getMenu(parsed.data.includeUnavailable);
    res.status(200).json(menu);
};