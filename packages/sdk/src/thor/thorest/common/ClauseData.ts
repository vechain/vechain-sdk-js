import { Address, HexUInt } from '@common/vcdm';
import { type ClauseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';
import { Clause } from '@thor/thor-client/model';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/model/ClauseData.ts!';

/**
 * Clause request and response data.
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */
class ClauseData extends Clause {
    /**
     * Creates a new Clause instance from the given ClauseJSON object.
     *
     * @param {ClauseJSON} json - The JSON object containing the input data to construct a Clause.
     *                             The `to` property represents the target address and is processed as an Address instance.
     *                             The `value` property is expected to be a hexadecimal value, parsed as a BigInt.
     *                             The `data` property is optional and, if present, is parsed as a HexUInt instance.
     * @return {Clause} A new Clause instance created using the data extracted from the provided ClauseJSON object.
     * @throws {IllegalArgumentError} If the provided JSON object contains invalid data or couldn't be properly parsed.
     */
    public static of(json: ClauseJSON): ClauseData {
        try {
            return new ClauseData(
                json.to !== null ? Address.of(json.to) : null,
                HexUInt.of(json.value).bi,
                json.data !== undefined ? HexUInt.of(json.data) : null
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}of(json ClauseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { ClauseData };
