import { Hex } from './Hex';
import { type HexUInt } from './HexUInt';
import { RevisionLike } from './RevisionLike';
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
     * Regular expression patterns for revision parsing from strings.
     */
    private static readonly VALID_REVISION_LABEL_REGEX =
        /^(best|finalized|next|justified)$/;
    private static readonly DECIMAL_REVISION_REGEX = /^\d+$/;
    private static readonly HEX_REVISION_REGEX = /^0x[0-9a-fA-F]+$/;

    /**
     * Creates a new Revision object from the given value.
     *
     * @param {RevisionLike Hex } value - The value to create the Revision from
     * @returns {Revision} - The created Revision object
     * @throws {IllegalArgumentError} if the given value is not a valid revision
     */
    public static of(value: RevisionLike | Hex): Revision {
        if (value instanceof Revision) {
            return value;
        }
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
        // If string, determine by pattern
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                throw new IllegalArgumentError(
                    `${FQP}Revision.of(value: RevisionLike | Hex): Revision`,
                    'revision string cannot be empty',
                    { value }
                );
            }

            const lowerCased = trimmed.toLowerCase();
            if (Revision.VALID_REVISION_LABEL_REGEX.test(lowerCased)) {
                return new Revision(lowerCased, RevisionType.Label);
            }

            if (Revision.DECIMAL_REVISION_REGEX.test(trimmed)) {
                const numericValue = BigInt(trimmed);
                return new Revision(numericValue, RevisionType.BlockNumber);
            }

            if (Revision.HEX_REVISION_REGEX.test(trimmed)) {
                return new Revision(
                    Hex.of(trimmed),
                    RevisionType.BlockId
                );
            }
        }
        // If not a valid revision, throw an error
        throw new IllegalArgumentError(
            `${FQP}Revision.of(value: RevisionLike | Hex): Revision`,
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
