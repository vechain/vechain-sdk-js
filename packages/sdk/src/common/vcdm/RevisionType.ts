import { Revision } from './Revision';

/**
 * The type of a Revision.
 */
enum RevisionType {
    /** The revision is a label */
    Label = 0,
    /** The revision is a block number */
    BlockNumber = 1,
    /** The revision is a block id */
    BlockId = 2
}

export { RevisionType };
