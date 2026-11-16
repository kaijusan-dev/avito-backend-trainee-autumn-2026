import type { ErrorCode } from "./error.schema.js";

export class HttpError extends Error {
    statusCode: number;
    code: ErrorCode;

    constructor(
        name: string,
        message: string,
        statusCode: number,
        code: ErrorCode
    ) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.code = code;
    };
};

export class NotFoundError extends HttpError {
    constructor() {
        super('NotFoundError', 'Продукт не найден!', 404, 'ITEM_NOT_FOUND');
    };
};

export class PathNotFoundError extends HttpError {
    constructor( path: string ) {
        super('PathNotFoundError', `Маршрут ${path} не найден`, 404, 'PATH_NOT_FOUND');
    };
};

export class BadRequestError extends HttpError {
    constructor( message: string = 'Неверный запрос!' ) {
        super('BadRequestError', message, 400, 'VALIDATION_ERROR');
    };
};

export class ConflictError extends HttpError {
    constructor( message: string ) {
        super('ConflictError', message, 409, 'CONFLICT');
    };
};