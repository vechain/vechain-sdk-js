import { assert, DATA } from '@vechain/sdk-errors';
import { revisionUtils } from '../../utils';

/**
 * Assert if a given revision is valid.
 * A valid revision is a string representing a block number or block id.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param revision - Revision to assert
 */
function assertIsRevisionForBlock(
    methodName: string,
    revision?: string | number
): void {
    assert(
        `assertIsRevisionForBlock - ${methodName}`,
        revision === undefined ||
            revision === null ||
            revisionUtils.isRevisionBlock(revision),
        DATA.INVALID_DATA_TYPE,
        'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
        { revision }
    );
}

/**
 * Assert if a given revision is valid.
 * A valid revision is a string representing a block number or block id.
 *
 * @param methodName - The name of the method calling this assertion.
 * @param revision - Revision to assert
 */
function assertIsRevisionForAccount(
    methodName: string,
    revision?: string | number
): void {
    assert(
        `assertIsRevisionForAccount - ${methodName}`,
        revision === undefined ||
            revision === null ||
            revisionUtils.isRevisionAccount(revision),
        DATA.INVALID_DATA_TYPE,
        'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block).',
        { revision }
    );
}

export { assertIsRevisionForBlock, assertIsRevisionForAccount };
