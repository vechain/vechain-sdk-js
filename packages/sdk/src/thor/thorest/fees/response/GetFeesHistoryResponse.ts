import { type Hex, HexUInt, HexUInt32, Quantity } from '@common/vcdm';
import { type GetFeesHistoryResponseJSON } from '@thor/thorest';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/fees/response/GetFeesHistoryResponse.ts!';

/**
 * [GetFeesHistoryResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetFeesHistoryResponse)
 */
class GetFeesHistoryResponse {
    /**
     * The VeChain block identifier of the oldest block in the response.
     */
    readonly oldestBlock: Hex;

    /**
     * An array of base fees per block as hexadecimal strings. They will be 0x0 for blocks previous to the Galactic fork.
     */
    readonly baseFeePerGas: bigint[];

    /**
     * An array of gas used ratios per block as float numbers.
     */
    readonly gasUsedRatio: number[];

    /**
     * An array of arrays of rewards by the percentiles provided in the request via rewardPercentiles.
     * Each inner array contains the reward values for each percentile requested.
     */
    readonly reward: bigint[][];

    /**
     * Constructs an instance of the class using the provided JSON data.
     *
     * @param {GetFeesHistoryResponseJSON} json - The JSON object containing fee history response data.
     * @return {void} Initializes the instance properties such as `oldestBlock`, `baseFeePerGas`, `gasUsedRatio`, and `reward` from the parsed JSON data.
     * @throws {IllegalArgumentError} Throws an error if the JSON parsing fails or is invalid.
     */
    constructor(json: GetFeesHistoryResponseJSON) {
        try {
            this.oldestBlock = HexUInt32.of(json.oldestBlock);
            this.baseFeePerGas = json.baseFeePerGas.map(
                (fee: string): bigint => HexUInt.of(fee).bi
            );
            this.gasUsedRatio = json.gasUsedRatio;
            this.reward =
                json.reward === undefined
                    ? []
                    : json.reward.map((reward: string[]): bigint[] =>
                          reward.map((r: string): bigint => HexUInt.of(r).bi)
                      );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetFeesHistoryResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of GetFeesHistoryResponse into its JSON representation.
     *
     * @return {GetFeesHistoryResponseJSON} A JSON object containing the representation of the fees history, including:
     * oldest block identifier, base fee per gas as strings, gas used ratio, and reward data formatted as strings.
     */
    toJSON(): GetFeesHistoryResponseJSON {
        return {
            oldestBlock: HexUInt32.of(this.oldestBlock).toString(),
            baseFeePerGas: this.baseFeePerGas.map((fee: bigint): string =>
                Quantity.of(fee).toString()
            ),
            gasUsedRatio: this.gasUsedRatio,
            reward:
                this.reward.length > 0
                    ? this.reward.map((reward: bigint[]): string[] =>
                          reward.map((r: bigint): string =>
                              Quantity.of(r).toString()
                          )
                      )
                    : undefined
        };
    }
}

export { GetFeesHistoryResponse };
