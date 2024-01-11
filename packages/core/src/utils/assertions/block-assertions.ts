import { DATA, assert } from '@vechain/vechain-sdk-errors';
import { revisionUtils } from '../revision';

/**
 * Assert if a given revision is valid.
 * A valid revision is a string representing a block number or block id.
 *
 * @param revision - Revision to assert
 */
function assertIsRevisionForBlock(revision?: string | number): void {
    assert(
        revision === undefined ||
            revision === null ||
            revisionUtils.isRevisionBlock(revision),
        DATA.INVALID_DATA_TYPE,
        'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
        { revision }
    );
}

function assertIsRevisionForAccount(revision?: string | number): void {
    assert(
        revision === undefined ||
            revision === null ||
            revisionUtils.isRevisionAccount(revision),
        DATA.INVALID_DATA_TYPE,
        'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block).',
        { revision }
    );
}

export { assertIsRevisionForBlock, assertIsRevisionForAccount };
