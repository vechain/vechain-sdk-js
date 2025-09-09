import { Block } from '@thor/thorest/blocks/model';
import { type Hex, HexUInt32 } from '@common/vcdm';
import { type RegularBlockResponseJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';
/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/blocks/response/RegularBlockResponse.ts!';

/**
 * [RegularBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/RegularBlockResponse)
 */
class RegularBlockResponse extends Block {
    /**
     * Whether the block is trunk (true) or not (false).
     */
    readonly isTrunk: boolean;

    /**
     * Whether the block has been finalized (true) or not (false).
     */
    readonly isFinalized: boolean;

    /**
     * An array of transaction IDs.
     */
    readonly transactions: Hex[];

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {RegularBlockResponseJSON} json - The JSON object containing data to construct the instance.
     * @throws {IllegalArgumentError} Throws if the parsing of the provided JSON object fails.
     */
    constructor(json: RegularBlockResponseJSON) {
        try {
            super(json);
            this.isTrunk = json.isTrunk;
            this.isFinalized = json.isFinalized;
            this.transactions = json.transactions.map(
                (txId: string): Hex => HexUInt32.of(txId)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: RegularBlockResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the object into a JSON representation.
     *
     * @return {RegularBlockResponseJSON} A JSON object containing the serialized representation of the instance, including properties such as `isTrunk`, `isFinalized`, and a list of `transactions` as strings.
     */
    toJSON(): RegularBlockResponseJSON {
        return {
            ...super.toJSON(),
            isTrunk: this.isTrunk,
            isFinalized: this.isFinalized,
            transactions: this.transactions.map((txId: Hex): string =>
                txId.toString()
            )
        };
    }
}

export { RegularBlockResponse };
