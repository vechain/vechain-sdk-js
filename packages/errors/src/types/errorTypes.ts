import type { ErrorBase } from '../model';
import { InvalidAddressError, InvalidChecksumError } from '../model/address';
import {
    InvalidMessageHashError,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    InvalidSignatureRecoveryError
} from '../model/secp256k1';

import type { InvalidPrivateKeyErrorData } from '../model/secp256k1';

export enum SECP256K1 {
    INVALID_PRIVATE_KEY = 'INVALID_PRIVATE_KEY',
    INVALID_MESSAGE_HASH = 'INVALID_MESSAGE_HASH',
    INVALID_SIGNATURE = 'INVALID_SIGNATURE',
    INVALID_SIGNATURE_RECOVERY = 'INVALID_SIGNATURE_RECOVERY'
}

export enum ADDRESS {
    INVALID_ADDRESS = 'INVALID_ADDRESS',
    INVALID_CHECKSUM = 'INVALID_CHECKSUM'
}

export type ErrorCode = SECP256K1 | ADDRESS;

/**
 * Default error data type. it accepts any object.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export type DefaultErrorData = Record<string, unknown>;

export const ERROR_CODES = { SECP256K1, ADDRESS };

/**
 * Conditional type to get the error data type from the error code.
 * The type is used to specify the data type of the error builder.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export type DataType<ErrorCodeT extends ErrorCode> =
    ErrorCodeT extends SECP256K1.INVALID_PRIVATE_KEY
        ? InvalidPrivateKeyErrorData
        : DefaultErrorData;

/**
 * Conditional type to get the error type from the error code.
 * The type is used to specify the return type of the error builder.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export type ErrorType<ErrorCodeT> =
    ErrorCodeT extends SECP256K1.INVALID_PRIVATE_KEY
        ? InvalidPrivateKeyError
        : ErrorCodeT extends SECP256K1.INVALID_MESSAGE_HASH
        ? InvalidMessageHashError
        : ErrorCodeT extends SECP256K1.INVALID_SIGNATURE
        ? InvalidSignatureError
        : ErrorCodeT extends SECP256K1.INVALID_SIGNATURE_RECOVERY
        ? InvalidSignatureRecoveryError
        : ErrorCodeT extends ADDRESS.INVALID_ADDRESS
        ? InvalidAddressError
        : ErrorCodeT extends ADDRESS.INVALID_CHECKSUM
        ? InvalidChecksumError
        : never;

/**
 * Map to get the error class from the error code.
 * The class is used to construct the error object.
 * @param ErrorCodeT - The error code type from the error types enum.
 */
export const ErrorClassMap = new Map<
    ErrorCode,
    typeof ErrorBase<ErrorCode, DataType<ErrorCode>>
>([
    [ADDRESS.INVALID_ADDRESS, InvalidAddressError],
    [ADDRESS.INVALID_CHECKSUM, InvalidChecksumError],
    [SECP256K1.INVALID_PRIVATE_KEY, InvalidPrivateKeyError],
    [SECP256K1.INVALID_MESSAGE_HASH, InvalidMessageHashError],
    [SECP256K1.INVALID_SIGNATURE, InvalidSignatureError],
    [SECP256K1.INVALID_SIGNATURE_RECOVERY, InvalidSignatureRecoveryError]
]);
