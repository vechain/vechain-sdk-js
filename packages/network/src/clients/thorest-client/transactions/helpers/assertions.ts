import { assert, DATA } from '@vechainfoundation/vechain-sdk-errors';
import { dataUtils } from '@vechainfoundation/vechain-sdk-core';

/**
 * Assert if transaction ID is valid
 *
 * @param transactionId - Transaction ID to assert
 */
function assertValidTransactionID(transactionId: string): void {
    assert(
        dataUtils.isThorId(transactionId, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid transaction ID given as input. Input must be an hex string of length 64.',
        { transactionId }
    );
}

/**
 * Assert if transaction head is valid
 * @param head - Transaction head to assert
 */
function assertValidTransactionHead(head?: string): void {
    assert(
        head === undefined || dataUtils.isThorId(head, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid head given as input. Input must be an hex string of length 64.',
        { head }
    );
}

export { assertValidTransactionID, assertValidTransactionHead };
