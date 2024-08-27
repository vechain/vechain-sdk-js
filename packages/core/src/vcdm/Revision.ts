import { Txt } from './Txt';
import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';
import { HexUInt } from './HexUInt';

/**
 * Represents a revision for a Thor transaction or block.
 *
 * @remarks The string representation of the revision is always expressed as a number in base 10.
 *
 * @extends Txt
 */
class Revision extends Txt {
    /**
     * Regular expression pattern for revision strings.
     * Revision strings can be one of the following:
     * - "best": indicating the best revision
     * - "finalized": indicating a finalized revision
     * - A positive numeric string indicating a specific revision
     *
     * @type {RegExp}
     */
    private static readonly REGEX_DECIMAL_REVISION = /^(best|finalized|\d+)$/;

    /**
     * Determines if the given value is valid.
     * This is true if the given value is
     * - "best" string or {@link Txt}: indicating the best revision;
     * - "finalized" string or {@link Txt}: indicating a finalized revision;
     * - a positive number;
     * - a positive numeric decimal or `0x` prefixed hexadecimal string indicating a specific revision,
     *
     * @param {bigint | number | string | Hex | Txt} value - The value to be validated.
     * @returns {boolean} - Returns `true` if the value is valid, `false` otherwise.
     */
    public static isValid(value: number | string): boolean {
        if (typeof value === 'number') {
            return Number.isInteger(value) && value >= 0;
        }
        return (
            HexUInt.isValid0x(value) ||
            Revision.REGEX_DECIMAL_REVISION.test(value)
        );
    }

    /**
     * Creates a new Revision object from the given value.
     *
     * @param {bigint | number | string | Uint8Array | Hex } value - The value to create the Revision from:
     * * {@link Hex} must be positive;
     * * {@link Uint8Array} is decoded as a string: see {@link Txt.of}.
     *
     * @returns {Revision} - The created Revision object.
     *
     *  @throws {InvalidDataType} if the given value is not a valid revision: see {@link isValid}.
     *
     * @remarks The string representation of the revision is always expressed as a number in base 10.
     * @remarks The {@link Uint8Array} value is decoded as a string content: see {@link Txt.of}.
     */
    public static of(value: bigint | number | string | Uint8Array | Hex): Txt {
        try {
            let txt: string;
            if (value instanceof Hex) {
                txt = value.bi.toString();
            } else if (value instanceof Uint8Array) {
                txt = Txt.of(value).toString();
            } else {
                txt = `${value}`;
            }
            if (Revision.isValid(txt)) {
                return new Revision(txt);
            }
            throw new InvalidDataType('Revision.of', 'not a revision', {
                value: `${value}`
            });
        } catch (e) {
            throw new InvalidDataType('Revision.of', 'not a revision', {
                value: `${value}`,
                e
            });
        }
    }
}

// Backwards compatibility, remove when it is matured enough #1184

const revisionUtils = {
    isRevisionAccount: (revision: string | number): boolean =>
        Revision.isValid(revision),
    isRevisionBlock: (revision: string | number): boolean =>
        Revision.isValid(revision)
};

export { Revision, revisionUtils };
