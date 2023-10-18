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

export type DefaultErrorData = Record<string, unknown>;

export const ERROR_CODES = { SECP256K1, ADDRESS };

export type DataType<T extends ErrorCode> =
    T extends SECP256K1.INVALID_PRIVATE_KEY
        ? InvalidPrivateKeyErrorData
        : DefaultErrorData;

export type ErrorType<T> = T extends SECP256K1.INVALID_PRIVATE_KEY
    ? InvalidPrivateKeyError
    : T extends SECP256K1.INVALID_MESSAGE_HASH
    ? InvalidMessageHashError
    : T extends SECP256K1.INVALID_SIGNATURE
    ? InvalidSignatureError
    : T extends SECP256K1.INVALID_SIGNATURE_RECOVERY
    ? InvalidSignatureRecoveryError
    : T extends ADDRESS.INVALID_ADDRESS
    ? InvalidAddressError
    : T extends ADDRESS.INVALID_CHECKSUM
    ? InvalidChecksumError
    : never;

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
