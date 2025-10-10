import { Hex } from './Hex';
import { type HexUInt } from './HexUInt';
import { RevisionType } from './RevisionType';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/common/vcdm/Revision.ts!';

/**
 * Represents a revision for a Thor transaction or block.
 * A revsion can be:
 * - a label: "best", "justified", "next", "finalized"
 * - a block number: a positive number
 * - a block id: a hex string block id
 */
class Revision {
    /**
     * The type of the revision.
     */
    public readonly revisionType: RevisionType;

    public readonly revisionValue: bigint | number | string | HexUInt;

    /**
     * Creates a new Revision object from the given value.
     *
     * @param {string} txt - The string representation of the revision.
     * @param {RevisionType} revisionType - The type of the revision.
     */
    private constructor(
        value: bigint | number | string | Hex,
        revisionType: RevisionType
    ) {
        this.revisionValue = value;
        this.revisionType = revisionType;
    }

    /**
     * Regular expression pattern for revision labels.
     */
    private static readonly VALID_REVISION_LABEL_REGEX =
        /^(best|finalized|next|justified)$/;

    /**
     * Creates a new Revision object from the given value.
     *
     * @param {bigint | number | string | Hex } value - The value to create the Revision from
     * @returns {Revision} - The created Revision object
     * @throws {IllegalArgumentError} if the given value is not a valid revision
     */
    public static of(value: bigint | number | string | Hex): Revision {
        // If Hex, its a block Id
        if (value instanceof Hex) {
            if (value.bi >= BigInt(0)) {
                return new Revision(value, RevisionType.BlockId);
            }
        }
        // If number, its a block number
        if (typeof value === 'number') {
            if (value >= 0) {
                return new Revision(value, RevisionType.BlockNumber);
            }
        }
        // If bigint, its a block number
        if (typeof value === 'bigint') {
            if (value >= BigInt(0)) {
                return new Revision(value, RevisionType.BlockNumber);
            }
        }
        // If string, its a label
        if (typeof value === 'string') {
            if (Revision.VALID_REVISION_LABEL_REGEX.test(value)) {
                return new Revision(value, RevisionType.Label);
            }
        }
        // If not a valid revision, throw an error
        throw new IllegalArgumentError(
            `${FQP}Revision.of(value: bigint | number | string | Hex): Revision`,
            'not a valid revision',
            {
                value: `${value}`
            }
        );
    }

    /**
     * Returns a string representation of the Revision.
     *
     * @return {string} The string representation of the Revision.
     */
    public toString(): string {
        return this.revisionValue.toString();
    }

    /**
     * Return the `best` revision instance.
     */
    public static readonly BEST: Revision = Revision.of('best');

    /**
     * Return the `finalized` revision instance.
     */
    public static readonly FINALIZED: Revision = Revision.of('finalized');

    /**
     * Return the `next` revision instance.
     */
    public static readonly NEXT: Revision = Revision.of('next');

    /**
     * Return the `justified` revision instance.
     */
    public static readonly JUSTIFIED: Revision = Revision.of('justified');

    /**
     * Return the `genesis` revision instance.
     */
    public static readonly GENESIS: Revision = Revision.of(0);
}

export { Revision };
