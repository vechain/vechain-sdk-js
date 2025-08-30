import { HexUInt } from '@common/vcdm';
import { type GetFeesPriorityResponseJSON } from '@thor/thorest';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/fees/response/GetFeesPriorityResponse.ts!';

/**
 * [GetFeesPriorityResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetFeesPriorityResponse)
 */
class GetFeesPriorityResponse {
    /**
     * The suggested maximum priority fee per gas as an hexadecimal string.
     */
    readonly maxPriorityFeePerGas: bigint;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {GetFeesPriorityResponseJSON} json - The JSON object containing the fee priority details.
     * @return {void} Initializes the instance with the max priority fee per gas value.
     */
    constructor(json: GetFeesPriorityResponseJSON) {
        try {
            this.maxPriorityFeePerGas = HexUInt.of(
                json.maxPriorityFeePerGas
            ).bi;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json GetFeesPriorityResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a JSON representation.
     *
     * @return {GetFeesPriorityResponseJSON} A JSON object representing the current state of the instance.
     */
    toJSON(): GetFeesPriorityResponseJSON {
        return {
            maxPriorityFeePerGas: HexUInt.of(
                this.maxPriorityFeePerGas
            ).toString()
        } satisfies GetFeesPriorityResponseJSON;
    }
}

export { GetFeesPriorityResponse };
