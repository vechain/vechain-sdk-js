import { Hex } from './Hex';
import { Txt } from './Txt';
/**
 * Represents a revision for a Thor transaction or block
 * Revision strings can be one of the following:
 * - "best": indicating the best revision
 * - "finalized": indicating a finalized revision
 * - "next": indicating the next revision
 * - "justified": indicating the justified revision
 * - A hex string prefixed with "0x" indicating a specific block id
 * - A positive number indicating a specific block number
 *
 * @extends Txt
 */
declare class Revision extends Txt {
    /**
     * Regular expression pattern for revision strings.
     *
     * @type {RegExp}
     */
    private static readonly VALID_REVISION_REGEX;
    /**
     * Determines if the given value is a valid revision.
     * @param {bigint| number | string | Hex} value - The value to be validated.
     * @returns {boolean} - Returns `true` if the value is valid, `false` otherwise.
     */
    static isValid(value: bigint | number | string | Hex): boolean;
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
    static of(value: bigint | number | string | Uint8Array | Hex): Txt;
    /**
     * Return the `best` revision instance.
     */
    static readonly BEST: Revision;
    /**
     * Return the `finalized` revision instance.
     */
    static readonly FINALIZED: Revision;
    /**
     * Return the `next` revision instance.
     */
    static readonly NEXT: Revision;
    /**
     * Return the `justified` revision instance.
     */
    static readonly JUSTIFIED: Revision;
}
export { Revision };
//# sourceMappingURL=Revision.d.ts.map