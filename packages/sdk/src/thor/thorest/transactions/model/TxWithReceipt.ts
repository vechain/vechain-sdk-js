import { Address, HexUInt, Quantity } from '@common/vcdm';
import { type OutputJSON, type TxWithReceiptJSON } from '@thor/thorest/json';
import { Tx } from '@thor/thorest/transactions/model/Tx';
import { IllegalArgumentError } from '@common/errors';
import { OutputResponse } from '@thor/thorest/common';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/transactions/model/TxWithReceipt.ts!';

/**
 * Type of the property
 * [ExpandedBlockResponse.transactions](http://localhost:8669/doc/stoplight-ui/#/schemas/ExpandedBlockResponse)
 * combines
 * [Tx](http://localhost:8669/doc/stoplight-ui/#/schemas/Tx)
 * and
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class TxWithReceipt extends Tx {
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
    readonly outputs: OutputResponse[];

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {TxWithReceiptJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: TxWithReceiptJSON) {
        try {
            super(json);
            this.gasUsed = BigInt(json.gasUsed);
            this.gasPayer = Address.of(json.gasPayer);
            this.paid = HexUInt.of(json.paid).bi;
            this.reward = HexUInt.of(json.reward).bi;
            this.reverted = json.reverted;
            this.outputs = json.outputs.map(
                (output: OutputJSON): OutputResponse =>
                    new OutputResponse(output)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TxWithReceiptJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a ReceiptJSON representation.
     *
     * @return {TxWithReceiptJSON} The JSON object representing the current instance.
     */
    toJSON(): TxWithReceiptJSON {
        return {
            ...super.toJSON(),
            gasUsed: Number(this.gasUsed),
            gasPayer: this.gasPayer.toString(),
            paid: Quantity.of(this.paid).toString(), // trim not significant zeros
            reward: Quantity.of(this.reward).toString(), // trim not significant zeros
            reverted: this.reverted,
            outputs: this.outputs.map(
                (output: OutputResponse): OutputJSON => output.toJSON()
            )
        } satisfies TxWithReceiptJSON;
    }
}

export { TxWithReceipt };
