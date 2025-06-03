import {
    Address,
    HexUInt,
    IllegalArgumentError,
    Quantity
} from '@vechain/sdk-core';
import { type XClauseJSON } from '@thor/blocks/XClauseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/XClause.ts';

/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */

class XClause {
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
    readonly data: HexUInt;

    /**
     * Constructs an instance of the class using the provided _ClauseJSON object.
     *
     * @param {XClauseJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: XClauseJSON) {
        try {
            this.to = json.to !== null ? Address.of(json.to) : undefined;
            this.value = HexUInt.of(json.value).bi;
            this.data = HexUInt.of(json.data);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: _ClauseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a _ClauseJSON representation.
     *
     * @return {_ClauseJSON} The JSON object representing the current instance.
     */
    toJSON(): XClauseJSON {
        return {
            to: this.to !== undefined ? this.to.toString() : null,
            // eslint-disable-next-line @typescript-eslint/no-base-to-string,sonarjs/no-base-to-string
            value: Quantity.of(this.value).toString(),
            data: this.data.toString()
        } satisfies XClauseJSON;
    }
}

export { XClause };
