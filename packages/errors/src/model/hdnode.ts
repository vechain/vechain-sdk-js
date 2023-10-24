import type { DefaultErrorData, HDNODE } from '../types';
import { ErrorBase } from './base';

/**
 * Invalid chaincode error to be thrown when an invalid chaincode is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidChaincodeError extends ErrorBase<
    HDNODE.INVALID_CHAINCODE,
    DefaultErrorData
> {}

/**
 * Invalid mnemonics error to be thrown when an invalid mnemonic is provided.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidMnemonicsError extends ErrorBase<
    HDNODE.INVALID_MNEMONICS,
    DefaultErrorData
> {}

/**
 * Invalid private key error to be thrown when an invalid private key is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidPrivateKeyError extends ErrorBase<
    HDNODE.INVALID_PRIVATEKEY,
    DefaultErrorData
> {}

/**
 * Invalid public key error to be thrown when an invalid public key is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
export class InvalidPublicKeyError extends ErrorBase<
    HDNODE.INVALID_PUBLICKEY,
    DefaultErrorData
> {}
