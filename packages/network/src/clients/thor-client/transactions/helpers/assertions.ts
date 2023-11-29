import { type Transaction } from '@vechainfoundation/vechain-sdk-core';
import { TRANSACTION, assert } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Asserts that the given transaction is signed.
 * @param tx - The transaction to check.
 *
 * @throws {InvalidTransactionError} if the transaction is not signed.
 */
const assertIsSignedTx = (tx: Transaction): void => {
    assert(tx.isSigned, TRANSACTION.NOT_SIGNED, 'Transaction must be signed.', {
        tx
    });
};

export { assertIsSignedTx };
