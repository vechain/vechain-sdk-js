import { HEX } from '../../hex';
import { assert, DATA } from '@vechain/sdk-errors';

/**
 * Represents a revision for a Thor transaction or block.
 *
 * @remark The string representation of the revision is always expressed as a number in base 10.
 */
class Revision extends String {
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
     * - "best" string: indicating the best revision,
     * - "finalized" string: indicating a finalized revision,
     * - An {@link HEX} object,
     * - A positive numeric string indicating a specific revision,
     * - A positive number.
     *
     * @param {HEX | number | string} value - The value to be validated.
     * @returns {boolean} - Returns `true` if the value is valid, `false` otherwise.
     */
    public static isValid(value: HEX | number | string): boolean {
        switch (typeof value) {
            case 'number':
                return value >= 0;
            case 'string':
                return Revision.REGEX_REVISION.test(value);
            default:
                return true;
        }
    }

    /**
     * Creates a new Revision object from the given value.
     *
     * @param {HEX | number | string} value - The value to create the Revision from.
     * @throws {InvalidDataTypeError} if the given value is not a valid revision: see {@link isValid}.
     *
     * @returns {Revision} - The created Revision object.
     *
     * @remark The string representation of the revision is always expressed as a number in base 10.
     */
    public static of(value: HEX | number | string): Revision {
        assert(
            'Revision.of',
            this.isValid(value),
            DATA.INVALID_DATA_TYPE,
            'value is not a Revision expression',
            { value }
        );
        return new Revision(
            value instanceof HEX ? value.n.toString() : value.toString()
        );
    }
}

export { Revision };
