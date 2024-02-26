import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Invalid Transaction to sign. It is already signed.
 */
class TransactionAlreadySignedError extends ErrorBase<
    TRANSACTION.ALREADY_SIGNED,
    DefaultErrorData
> {}

/**
 * Transaction not signed.
 */
class TransactionNotSignedError extends ErrorBase<
    TRANSACTION.NOT_SIGNED,
    DefaultErrorData
> {}

/**
 * Invalid Transaction body.
 */
class TransactionBodyError extends ErrorBase<
    TRANSACTION.INVALID_TRANSACTION_BODY,
    DefaultErrorData
> {}

/**
 * Invalid Delegation feature.
 */
class TransactionDelegationError extends ErrorBase<
    TRANSACTION.INVALID_DELEGATION,
    DefaultErrorData
> {}

/**
 * Error to be thrown when the private key is missing.
 */
class TransactionMissingPrivateKeyError extends ErrorBase<
    TRANSACTION.MISSING_PRIVATE_KEY,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum TRANSACTION {
    ALREADY_SIGNED = 'ALREADY_SIGNED',
    NOT_SIGNED = 'NOT_SIGNED',
    INVALID_TRANSACTION_BODY = 'INVALID_TRANSACTION_BODY',
    INVALID_DELEGATION = 'INVALID_DELEGATION',
    MISSING_PRIVATE_KEY = 'MISSING_PRIVATE_KEY'
}

export {
    TransactionAlreadySignedError,
    TransactionNotSignedError,
    TransactionBodyError,
    TransactionDelegationError,
    TransactionMissingPrivateKeyError,
    TRANSACTION
};
