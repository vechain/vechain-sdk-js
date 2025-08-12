import { Address, HexUInt, Quantity, type Hex } from '@common/vcdm';
import { type ClauseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/blocks/Clause.ts!';

/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */

class Clause {
    /**
     * The address that sent the VET.
     */
    readonly to?: Address;

    /**
     * The amount (wei) of VET to be transferred.
     */
    readonly value: bigint;

    /**
     * The input data for the clause (in bytes).
     */
    readonly data: Hex;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {ClauseJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} If the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: ClauseJSON) {
        try {
            this.to = json.to !== null ? Address.of(json.to) : undefined;
            this.value = HexUInt.of(json.value).bi;
            this.data = HexUInt.of(json.data ?? '0x');
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ClauseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a ClauseJSON representation.
     *
     * @return {ClauseJSON} The JSON object representing the current instance.
     */
    toJSON(): ClauseJSON {
        return {
            to: this.to !== undefined ? this.to.toString() : null,

            value: Quantity.of(this.value).toString(),
            data: this.data.toString()
        } satisfies ClauseJSON;
    }
}

export { Clause };
