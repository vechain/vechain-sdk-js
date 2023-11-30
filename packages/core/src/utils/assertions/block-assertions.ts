import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import { revisionUtils } from '../revision';

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

export { assertIsRevision };
