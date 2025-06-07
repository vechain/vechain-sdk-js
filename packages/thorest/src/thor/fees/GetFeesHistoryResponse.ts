import { type Hex, HexUInt, HexUInt32, Quantity } from '@vechain/sdk-core';
import { type GetFeesHistoryResponseJSON } from '@thor';

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

    constructor(json: GetFeesHistoryResponseJSON) {
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
