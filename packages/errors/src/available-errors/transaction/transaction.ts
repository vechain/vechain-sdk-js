import { VechainSDKError } from '../sdk-error';
import type { ObjectErrorData } from '../types';

/**
 * Unavailable transaction field (field name) error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a transaction (field name) in a transaction is unavailable.
 */
class UnavailableTransactionField extends VechainSDKError<{
    fieldName: string;
}> {}

/**
 * Invalid transaction field (field name) error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a transaction (field name) in a transaction is invalid.
 */
class InvalidTransactionField extends VechainSDKError<
    {
        fieldName: string;
    } & ObjectErrorData
> {}

/**
 * Not delegated transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not delegated.
 */
class NotDelegatedTransaction extends VechainSDKError<
    undefined | { delegatorUrl: string }
> {}

/**
 * Cannot find transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not into the blockchain.
 */
class CannotFindTransaction extends VechainSDKError<{
    transactionHash?: string;
    networkUrl?: string;
}> {}

export {
    UnavailableTransactionField,
    InvalidTransactionField,
    NotDelegatedTransaction,
    CannotFindTransaction
};
