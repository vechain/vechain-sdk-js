import { sign, signWithDelegator, decode } from './handlers';

/**
 * TransactionHandler provides a set of utility functions for signing and decoding
 * transactions.
 */
const TransactionHandler = {
    // Sign transaction
    sign,
    signWithDelegator,

    // Decode transaction
    decode
};
export { TransactionHandler };
