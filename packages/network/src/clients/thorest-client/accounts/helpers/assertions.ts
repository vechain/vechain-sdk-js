import { assert, DATA } from '@vechainfoundation/vechain-sdk-errors';
import { addressUtils } from '@vechainfoundation/vechain-sdk-core';
import { revisionUtils } from '../../../../utils';

/**
 * Assert if address is valid
 *
 * @param address - Address to assert
 */
function assertIsAddress(address: string): void {
    assert(
        addressUtils.isAddress(address),
        DATA.INVALID_DATA_TYPE,
        'Invalid address. The address must be 20 bytes (a 42 characters hex string with a `0x` prefix.)',
        { address }
    );
}

/**
 * Assert if revision is valid
 *
 * @param revision - Revision to assert
 */
function assertIsRevision(revision?: string): void {
    assert(
        revision === undefined ||
            revision === null ||
            revisionUtils.isRevisionAccount(revision),
        DATA.INVALID_DATA_TYPE,
        'Invalid revision. The revision must be a string representing a block number or block id.',
        { revision }
    );
}

export { assertIsAddress, assertIsRevision };
