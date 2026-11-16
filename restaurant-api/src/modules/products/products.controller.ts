import { type Request, type Response } from 'express';
import * as productsService from './products.service.js';
import {
    ProductLookupSchema,
    ProductParamsSchema,
    UpdateProductSchema,
} from './products.types.js';
import { BadRequestError } from '../../../../shared/src/errors/http.errors.js';

export const lookupProducts = async (req: Request, res: Response) => {
    const parsed = ProductLookupSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError();

    const result = await productsService.lookupProducts(parsed.data.productIds);
    res.status(200).json(result);
};

export const updateProduct = async (req: Request, res: Response) => {
    const parsedParams = ProductParamsSchema.safeParse(req.params);
    const parsedBody = UpdateProductSchema.safeParse(req.body);

    if (!parsedParams.success || !parsedBody.success) throw new BadRequestError();

    const product = await productsService.updateProduct(
        parsedParams.data.id,
        parsedBody.data,
    );
    res.status(200).json(product);
};