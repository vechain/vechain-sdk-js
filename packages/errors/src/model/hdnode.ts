import type { DefaultErrorData, HDNODE } from '../types';
import { ErrorBase } from './base';

/**
 * Invalid chaincode error to be thrown when an invalid chaincode is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidHDNodeChaincodeError extends ErrorBase<
    HDNODE.INVALID_HDNODE_CHAIN_CODE,
    DefaultErrorData
> {}

/**
 * Invalid mnemonics error to be thrown when an invalid mnemonic is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidHDNodeMnemonicsError extends ErrorBase<
    HDNODE.INVALID_HDNODE_MNEMONICS,
    DefaultErrorData
> {}

/**
 * Invalid private key error to be thrown when an invalid private key is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidHDNodePrivateKeyError extends ErrorBase<
    HDNODE.INVALID_HDNODE_PRIVATE_KEY,
    DefaultErrorData
> {}

/**
 * Invalid public key error to be thrown when an invalid public key is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidHDNodePublicKeyError extends ErrorBase<
    HDNODE.INVALID_HDNODE_PUBLIC_KEY,
    DefaultErrorData
> {}

export {
    InvalidHDNodeChaincodeError,
    InvalidHDNodeMnemonicsError,
    InvalidHDNodePrivateKeyError,
    InvalidHDNodePublicKeyError
};
