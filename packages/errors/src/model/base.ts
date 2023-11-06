import { type ErrorCode } from '../types';

/**
 * Base error class to construct all other errors from.
 * @param ErrorCodeT - The error code type from the error types enum.
 * @param DataTypeT - The error data type.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class ErrorBase<ErrorCodeT extends ErrorCode, DataTypeT> extends Error {
    code: ErrorCodeT;
    message: string;
    data?: DataTypeT;
    innerError?: Error;
    constructor({
        code,
        message,
        data,
        innerError
    }: {
        code: ErrorCodeT;
        message: string;
        data?: DataTypeT;
        innerError?: Error;
    }) {
        super();
        this.code = code;
        this.message = message;
        this.data = data;
        this.innerError = innerError;
    }
}

export { ErrorBase };
