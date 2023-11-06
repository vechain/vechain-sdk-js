import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid Transaction to sign. It is already signed.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class TransactionAlreadySignedError extends ErrorBase<
    TRANSACTION.ALREADY_SIGNED,
    DefaultErrorData
> {}

/**
 * Transaction not signed.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class TransactionNotSignedError extends ErrorBase<
    TRANSACTION.NOT_SIGNED,
    DefaultErrorData
> {}

/**
 * Invalid Transaction body.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class TransactionBodyError extends ErrorBase<
    TRANSACTION.INVALID_TRANSACTION_BODY,
    DefaultErrorData
> {}

/**
 * Invalid Delegation feature.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class TransactionDelegationError extends ErrorBase<
    TRANSACTION.INVALID_DELEGATION,
    DefaultErrorData
> {}

/**
 * Errors enum.
 *
 * @public
 */
enum TRANSACTION {
    ALREADY_SIGNED = 'ALREADY_SIGNED',
    NOT_SIGNED = 'NOT_SIGNED',
    INVALID_TRANSACTION_BODY = 'INVALID_TRANSACTION_BODY',
    INVALID_DELEGATION = 'INVALID_DELEGATION'
}

export {
    TransactionAlreadySignedError,
    TransactionNotSignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TRANSACTION
};
