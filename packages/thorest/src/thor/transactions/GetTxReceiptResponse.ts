import {
    Address,
    HexUInt,
    IllegalArgumentError,
    Quantity,
    UInt
} from '@vechain/sdk-core';
import {
    type GetTxReceiptResponseJSON,
    Output,
    type OutputJSON,
    ReceiptMeta
} from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/transactions/GetTxReceiptResponse.ts!';

/**
 * [GetTxReceiptResponse](http://localhost:8669/doc/stoplight-ui/#/paths/transactions-id/get)
 */
class GetTxReceiptResponse {
    /**
     * The transaction type of this receipt
     */
    readonly type: number | null;

    /**
     * The amount of gas used by the transaction.
     */
    readonly gasUsed: bigint;

    /**
     * The address of the account that paid the gas fee.
     */
    readonly gasPayer: Address;

    /**
     * The amount of energy (VTHO) in wei, used to pay for the gas.
     */
    readonly paid: bigint;

    /**
     * The amount of energy (VTHO) in wei, paid to the block signer as a reward.
     */
    readonly reward: bigint;

    /**
     * Indicates whether the transaction was reverted (true means reverted).
     */
    readonly reverted: boolean;

    /**
     * An array of outputs produced by the transaction.
     */
    readonly outputs: Output[];

    /**
     * The transaction receipt metadata such as block number, block timestamp, etc.
     */
    readonly meta: ReceiptMeta;

    constructor(json: GetTxReceiptResponseJSON) {
        try {
            this.type =
                json.type !== null && json.type !== undefined
                    ? UInt.of(json.type).valueOf()
                    : null;
            this.gasUsed = BigInt(json.gasUsed);
            this.gasPayer = Address.of(json.gasPayer);
            this.paid = HexUInt.of(json.paid).bi;
            this.reward = HexUInt.of(json.reward).bi;
            this.reverted = json.reverted;
            this.outputs = json.outputs.map(
                (outputJSON: OutputJSON): Output => new Output(outputJSON)
            );
            this.meta = new ReceiptMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: GetTxReceiptResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance into a GetTxReceiptResponseJSON representation.
     *
     * @return {GetTxReceiptResponseJSON} The JSON object representing the current instance.
     */
    toJSON(): GetTxReceiptResponseJSON {
        return {
            type: this.type,
            gasUsed: this.gasUsed.toString(),
            gasPayer: this.gasPayer.toString(),
            paid: Quantity.of(this.paid).toString(),
            reward: Quantity.of(this.reward).toString(),
            reverted: this.reverted,
            outputs: this.outputs.map(
                (output: Output): OutputJSON => output.toJSON()
            ),
            meta: this.meta.toJSON()
        } satisfies GetTxReceiptResponseJSON;
    }
}

export { GetTxReceiptResponse };
