import { ErrorBase } from '.';
import type { DefaultErrorData, SECP256K1 } from '../types';

export interface InvalidPrivateKeyErrorData {
    reason: string;
}

export class InvalidPrivateKeyError extends ErrorBase<
    SECP256K1.INVALID_PRIVATE_KEY,
    InvalidPrivateKeyErrorData
> {}

export class InvalidMessageHashError extends ErrorBase<
    SECP256K1.INVALID_MESSAGE_HASH,
    DefaultErrorData
> {}

export class InvalidSignatureError extends ErrorBase<
    SECP256K1.INVALID_SIGNATURE,
    DefaultErrorData
> {}

export class InvalidSignatureRecoveryError extends ErrorBase<
    SECP256K1.INVALID_SIGNATURE_RECOVERY,
    DefaultErrorData
> {}
