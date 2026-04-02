"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}
exports.ForbiddenError = ForbiddenError;
