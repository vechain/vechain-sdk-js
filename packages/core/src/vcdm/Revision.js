"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revision = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("./Hex");
const Txt_1 = require("./Txt");
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
class Revision extends Txt_1.Txt {
    /**
     * Regular expression pattern for revision strings.
     *
     * @type {RegExp}
     */
    static VALID_REVISION_REGEX = /^(best|finalized|next|justified|0x[a-fA-F0-9]+|\d+)$/;
    /**
     * Determines if the given value is a valid revision.
     * @param {bigint| number | string | Hex} value - The value to be validated.
     * @returns {boolean} - Returns `true` if the value is valid, `false` otherwise.
     */
    static isValid(value) {
        if (typeof value === 'number') {
            return Number.isInteger(value) && value >= 0;
        }
        if (typeof value === 'bigint') {
            return value >= BigInt(0);
        }
        if (value instanceof Hex_1.Hex) {
            return Revision.isValid(value.bi);
        }
        return Revision.VALID_REVISION_REGEX.test(value);
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
    static of(value) {
        try {
            // handle Uint8Array which is needed to extend Txt.of
            if (ArrayBuffer.isView(value)) {
                const txtValue = Txt_1.Txt.of(value).toString();
                if (Revision.isValid(txtValue)) {
                    return new Revision(txtValue);
                }
                else {
                    throw new sdk_errors_1.InvalidDataType('Revision.of', 'not a revision', {
                        value: `${value}`
                    });
                }
            }
            // handle other types
            if (Revision.isValid(value)) {
                return new Revision(`${value}`);
            }
            else {
                throw new sdk_errors_1.InvalidDataType('Revision.of', 'not a revision', {
                    value: `${value}`
                });
            }
        }
        catch (e) {
            throw new sdk_errors_1.InvalidDataType('Revision.of', 'not a revision', {
                value: `${value}`,
                e
            });
        }
    }
    /**
     * Return the `best` revision instance.
     */
    static BEST = Revision.of('best');
    /**
     * Return the `finalized` revision instance.
     */
    static FINALIZED = Revision.of('finalized');
    /**
     * Return the `next` revision instance.
     */
    static NEXT = Revision.of('next');
    /**
     * Return the `justified` revision instance.
     */
    static JUSTIFIED = Revision.of('justified');
}
exports.Revision = Revision;
