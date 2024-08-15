import { Txt } from './Txt';
import { Hex } from './Hex';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Represents a revision for a Thor transaction or block.
 *
 * @remark The string representation of the revision is always expressed as a number in base 10.
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
    private static readonly REGEX_REVISION = /^(best|finalized|\d+)$/;

    /**
     * Determines if the given value is valid.
     * This is true if the given value is
     * - "best" string or {@link Txt}: indicating the best revision;
     * - "finalized" string or {@link Txt}: indicating a finalized revision;
     * - a {@link Hex} positive value;
     * - a positive bigint value;
     * - a positive number;
     * - a positive numeric string or {@link Txt} indicating a specific revision,
     *
     * @param {bigint | number | string | Hex | Txt} value - The value to be validated.
     * @returns {boolean} - Returns `true` if the value is valid, `false` otherwise.
     */
    public static isValid(
        value: bigint | number | string | Hex | Txt
    ): boolean {
        if (typeof value === 'bigint') {
            return value >= 0;
        } else if (typeof value === 'number') {
            return Number.isInteger(value) && value >= 0;
        } else if (typeof value === 'string') {
            return Revision.REGEX_REVISION.test(value);
        } else if (value instanceof Txt) {
            return Revision.REGEX_REVISION.test(value.toString());
        }
        return value.sign >= 0;
    }

    /**
     * Creates a new Revision object from the given value.
     *
     * @param {bigint | number | string | Uint8Array | Hex | Txt} value - The value to create the Revision from.
     * @throws {InvalidDataType} if the given value is not a valid revision: see {@link isValid}.
     *
     * @returns {Revision} - The created Revision object.
     *
     * @remark The string representation of the revision is always expressed as a number in base 10.
     * @remark The {@link Uint8Array} value is decoded as a string content.
     */
    public static of(
        value: bigint | number | string | Uint8Array | Hex | Txt
    ): Txt {
        const txt =
            value instanceof Hex
                ? Txt.of(value.bi)
                : value instanceof Txt
                  ? value
                  : Txt.of(value);
        if (Revision.isValid(txt)) {
            return new Revision(txt.toString());
        }
        throw new InvalidDataType('Revision.of', 'not a revision', {
            value: `${value}`
        });
    }
}

export { Revision };
