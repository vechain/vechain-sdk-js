import {
    type SimulateTransactionClause,
    type SimulateTransactionOptions
} from '@vechain/vechain-sdk-network';

/**
 * Type for the method handler.
 * It is basically a function that takes an array of parameters and returns a promise.
 */
type MethodHandlerType<TParams, TReturnType> = (
    params: TParams[]
) => Promise<TReturnType>;

/**
 * Type for the transaction object.
 */
type TransactionObj = SimulateTransactionClause & SimulateTransactionOptions;

export { type MethodHandlerType, type TransactionObj };
