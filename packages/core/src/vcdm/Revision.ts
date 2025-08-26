import { InvalidDataType } from '@vechain/sdk-errors';
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
class Revision extends Txt {
    /**
     * Regular expression pattern for revision strings.
     *
     * @type {RegExp}
     */
    private static readonly VALID_REVISION_REGEX =
        /^(best|finalized|next|justified|0x[a-fA-F0-9]+|\d+)$/;

    /**
     * Determines if the given value is a valid revision.
     * @param {bigint| number | string | Hex} value - The value to be validated.
     * @returns {boolean} - Returns `true` if the value is valid, `false` otherwise.
     */
    public static isValid(value: bigint | number | string | Hex): boolean {
        if (typeof value === 'number') {
            return Number.isInteger(value) && value >= 0;
        }
        if (typeof value === 'bigint') {
            return value >= BigInt(0);
        }
        if (value instanceof Hex) {
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
    public static of(value: bigint | number | string | Uint8Array | Hex): Txt {
        try {
            // handle Uint8Array which is needed to extend Txt.of
            if (ArrayBuffer.isView(value)) {
                const txtValue = Txt.of(value).toString();
                if (Revision.isValid(txtValue)) {
                    return new Revision(txtValue);
                } else {
                    throw new InvalidDataType('Revision.of', 'not a revision', {
                        value: `${value}`
                    });
                }
            }
            // handle other types
            if (Revision.isValid(value)) {
                return new Revision(`${value}`);
            } else {
                throw new InvalidDataType('Revision.of', 'not a revision', {
                    value: `${value}`
                });
            }
        } catch (e) {
            throw new InvalidDataType('Revision.of', 'not a revision', {
                value: `${value}`,
                e
            });
        }
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
}

export { Revision };
