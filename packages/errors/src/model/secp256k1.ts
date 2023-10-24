import { ErrorBase } from '.';
import type { DefaultErrorData, SECP256K1 } from '../types';

/**
 * Error to be thrown when the private key is invalid.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidPrivateKeyError extends ErrorBase<
    SECP256K1.INVALID_PRIVATE_KEY,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the message hash is invalid.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidMessageHashError extends ErrorBase<
    SECP256K1.INVALID_MESSAGE_HASH,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the signature is invalid.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidSignatureError extends ErrorBase<
    SECP256K1.INVALID_SIGNATURE,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the signature recovery is invalid.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidSignatureRecoveryError extends ErrorBase<
    SECP256K1.INVALID_SIGNATURE_RECOVERY,
    DefaultErrorData
> {}
