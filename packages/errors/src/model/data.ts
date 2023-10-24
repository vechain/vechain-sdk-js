import type { DefaultErrorData, DATA } from '../types';
import { ErrorBase } from './base';

/**
 * Invalid data error to be thrown when an invalid data is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidDataTypeError extends ErrorBase<
    DATA.INVALID_DATA_TYPE,
    DefaultErrorData
> {}
