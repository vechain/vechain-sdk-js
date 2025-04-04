import {
    Address,
    Gas,
    Hex,
    HexUInt,
    UInt,
    Units,
    VTHO
} from '@vechain/sdk-core';
import { ReceiptOutput } from './ReceiptOutput';
import { type ReceiptJSON } from './ReceiptJSON';

/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class Receipt {
    /**
     * The transaction type of this receipt.
     */
    readonly type?: UInt;

    /**
     * The amount of gas used by the transaction.
     */
    readonly gasUsed: Gas;

    /**
     * The address of the account that paid the gas fee.
     */
    readonly gasPayer: Address;

    /**
     * The amount of energy (VTHO) in wei, used to pay for the gas.
     */
    readonly paid: VTHO;

    /**
     * The amount of energy (VTHO) in wei, paid to the block signer as a reward.
     */
    readonly reward: VTHO;

    /**
     * Indicates whether the transaction was reverted (true means reverted).
     */
    readonly reverted: boolean;

    /**
     * An array of outputs produced by the transaction.
     */
    readonly outputs: ReceiptOutput[];

    /**
     * Constructs a new instance of the class using the provided ReceiptJSON object.
     *
     * @param {ReceiptJSON} json - The JSON object containing the receipt data.
     */
    constructor(json: ReceiptJSON) {
        this.type =
            typeof json.type === 'number' ? UInt.of(json.type) : undefined;
        this.gasUsed = Gas.of(json.gasUsed);
        this.gasPayer = Address.of(json.gasPayer);
        this.paid = VTHO.of(Hex.of(json.paid).bi, Units.wei);
        this.reward = VTHO.of(Hex.of(json.reward).bi, Units.wei);
        this.reverted = json.reverted;
        this.outputs = json.outputs.map((output) => new ReceiptOutput(output));
    }

    /**
     * Converts the current Receipt object into a JSON representation.
     *
     * @return {ReceiptJSON} A JSON object representing the receipt, including details such as type, gas used,
     * gas payer, amounts paid and rewarded, whether the transaction was reverted, and the outputs in JSON format.
     */
    toJSON(): ReceiptJSON {
        return {
            type: this.type?.valueOf(),
            gasUsed: this.gasUsed.valueOf(),
            gasPayer: this.gasPayer.toString(),
            paid: HexUInt.of(this.paid.wei).toString(),
            reward: HexUInt.of(this.reward.wei).toString(),
            reverted: this.reverted,
            outputs: this.outputs.map((output) => output.toJSON())
        } satisfies ReceiptJSON;
    }
}

export { Receipt };
