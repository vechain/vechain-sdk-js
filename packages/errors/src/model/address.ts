import type { ADDRESS, DefaultErrorData } from '../types';
import { ErrorBase } from './base';

/**
 * Invalid address error to be thrown when an invalid address is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidAddressError extends ErrorBase<
    ADDRESS.INVALID_ADDRESS,
    DefaultErrorData
> {}

/**
 * Invalid address error to be thrown when an invalid checksum is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidChecksumError extends ErrorBase<
    ADDRESS.INVALID_CHECKSUM,
    DefaultErrorData
> {}
