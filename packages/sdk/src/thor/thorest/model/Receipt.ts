import { Address, HexUInt, Quantity, UInt } from '@common/vcdm';
import { Output } from '@thor/thorest/model/Output';
import { type ReceiptJSON, type OutputJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/model/Receipt.ts!';

/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */

class Receipt {
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
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {ReceiptJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: ReceiptJSON) {
        try {
            this.type =
                json.type !== null ? UInt.of(json.type).valueOf() : null;
            this.gasUsed = BigInt(json.gasUsed);
            this.gasPayer = Address.of(json.gasPayer);
            this.paid = HexUInt.of(json.paid).bi;
            this.reward = HexUInt.of(json.reward).bi;
            this.reverted = json.reverted;
            this.outputs = json.outputs.map(
                (output: OutputJSON): Output => new Output(output)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ReceiptJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a ReceiptJSON representation.
     *
     * @return {ReceiptJSON} The JSON object representing the current instance.
     */
    toJSON(): ReceiptJSON {
        return {
            type: this.type !== null ? this.type.valueOf() : null,
            gasUsed: Number(this.gasUsed),
            gasPayer: this.gasPayer.toString(),
            paid: Quantity.of(this.paid).toString(), // trim not significant zeros
            reward: Quantity.of(this.reward).toString(), // trim not significant zeros
            reverted: this.reverted,
            outputs: this.outputs.map(
                (output: Output): OutputJSON => output.toJSON()
            )
        } satisfies ReceiptJSON;
    }
}

export { Receipt };
