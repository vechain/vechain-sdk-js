import { type Hex, HexUInt32 } from '@vcdm';
import { type StorageRangeJSON } from '@/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/debug/StorageRange.ts!';

/**
 * [StorageRange](http://localhost:8669/doc/stoplight-ui/#/schemas/StorageRange)
 */
class StorageRange {
    /**
     * Represents the next cryptographic key in hexadecimal format or null.
     * Used to indicate the subsequent key in a sequence or no further key.
     *
     * @type {Hex|null}
     */
    readonly nextKey: Hex | null;

    /**
     * The data is non-nullable, but an empty object is returned if no data is found.
     */
    readonly storage: unknown;

    /**
     * Constructs an instance of the class.
     *
     * @param {StorageRangeJSON} json - An object containing storage range data.
     * Properties should include `nextKey` and `storage`.
     * @throws {IllegalArgumentError} Throws an error if the JSON parsing fails.
     */
    constructor(json: StorageRangeJSON) {
        try {
            this.nextKey =
                json.nextKey !== undefined ? HexUInt32.of(json.nextKey) : null;
            this.storage = json.storage;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: StorageRangeJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current object instance into a JSON representation adhering to the StorageRangeJSON structure.
     *
     * @return {StorageRangeJSON} The JSON representation of the current instance, including the next key as a string (or undefined) and storage details.
     */
    toJSON(): StorageRangeJSON {
        return {
            nextKey:
                this.nextKey !== null ? this.nextKey.toString() : undefined,
            storage: this.storage
        } satisfies StorageRangeJSON;
    }
}

export { StorageRange };
