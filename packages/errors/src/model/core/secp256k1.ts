import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Error to be thrown when the private key is invalid.
 */
class InvalidSecp256k1PrivateKeyError extends ErrorBase<
    SECP256K1.INVALID_SECP256k1_PRIVATE_KEY,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the message hash is invalid.
 */
class InvalidSecp256k1MessageHashError extends ErrorBase<
    SECP256K1.INVALID_SECP256k1_MESSAGE_HASH,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the signature is invalid.
 */
class InvalidSecp256k1SignatureError extends ErrorBase<
    SECP256K1.INVALID_SECP256k1_SIGNATURE,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the signature recovery is invalid.
 */
class InvalidSecp256k1SignatureRecoveryError extends ErrorBase<
    SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum SECP256K1 {
    INVALID_SECP256k1_PRIVATE_KEY = 'INVALID_SECP256k1_PRIVATE_KEY',
    INVALID_SECP256k1_MESSAGE_HASH = 'INVALID_SECP256k1_MESSAGE_HASH',
    INVALID_SECP256k1_SIGNATURE = 'INVALID_SECP256k1_SIGNATURE',
    INVALID_SECP256k1_SIGNATURE_RECOVERY = 'INVALID_SECP256k1_SIGNATURE_RECOVERY'
}

export {
    InvalidSecp256k1PrivateKeyError,
    InvalidSecp256k1MessageHashError,
    InvalidSecp256k1SignatureError,
    InvalidSecp256k1SignatureRecoveryError,
    SECP256K1
};
