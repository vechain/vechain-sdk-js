import { Address, HexUInt, IllegalArgumentError, UInt } from '../../../../core/src';
import { type _ClauseJSON } from './_ClauseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/_Clause.ts'; // todo: check once moved

/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */
// eslint-disable-next-line sonarjs/class-name
class _Clause {
    /**
     * The address that sent the VET.
     */
    readonly to?: Address;

    /**
     * The amount (wei) of VET to be transferred.
     */
    readonly value: UInt;

    /**
     * The input data for the clause (in bytes).
     */
    readonly data: HexUInt;

    /**
     * Constructs an instance of the class using the provided _ClauseJSON object.
     *
     * @param {_ClauseJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: _ClauseJSON) {
        try {
            this.to = json.to !== null ? Address.of(json.to) : undefined;
            this.value = UInt.of(HexUInt.of(json.value).n);
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
    toJSON(): _ClauseJSON {
        return {
            to: this.to !== undefined ? this.to.toString() : null,
            value: HexUInt.of(this.value.valueOf()).toString(),
            data: this.data.toString()
        } satisfies _ClauseJSON;
    }
}

export { _Clause };
