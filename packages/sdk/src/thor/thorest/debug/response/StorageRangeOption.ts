import { Address, type Hex, HexUInt32, UInt } from '@common/vcdm';
import { type StorageRangeOptionJSON } from '@thor/thorest/json';
import { TargetPath } from '@thor/thorest/debug/response';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified-Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/debug/response/StorageRangeOption.ts!';

/**
 * [StorageRangeOption](http://localhost:8669/doc/stoplight-ui/#/schemas/StorageRangeOption)
 */
class StorageRangeOption {
    /**
     * The address of the contract/ account to be traced.
     */
    readonly address: Address;

    /**
     * The start key of the storage range.
     */
    readonly keyStart: Hex | null;

    /**
     * The maximum number of results to be returned.
     */
    readonly maxResult: number | null;

    /**
     * The unified path of the transaction clause.
     */
    readonly target: TargetPath;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {StorageRangeOptionJSON} json - The JSON object containing the necessary properties.
     * @throws {IllegalArgumentError} - Throws if there is an error during parsing or invalid input structure.
     */
    constructor(json: StorageRangeOptionJSON) {
        try {
            this.address = Address.of(json.address);
            this.keyStart =
                json.keyStart !== undefined && json.keyStart !== null
                    ? HexUInt32.of(json.keyStart)
                    : null;
            this.maxResult =
                json.maxResult !== undefined && json.maxResult !== null
                    ? UInt.of(json.maxResult).valueOf()
                    : null;
            this.target = TargetPath.of(json.target);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: StorageRangeOptionJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of StorageRangeOption to a JSON representation.
     *
     * @return {StorageRangeOptionJSON} The JSON object representing the current instance.
     */
    toJSON(): StorageRangeOptionJSON {
        return {
            address: this.address.toString(),
            keyStart:
                this.keyStart !== null ? this.keyStart.toString() : undefined,
            maxResult: this.maxResult ?? undefined,
            target: this.target.toString()
        } satisfies StorageRangeOptionJSON;
    }
}

export { StorageRangeOption };
