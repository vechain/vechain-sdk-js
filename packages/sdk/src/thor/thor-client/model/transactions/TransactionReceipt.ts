import { type Address } from '@common/vcdm';
import { TransactionReceiptMeta } from './TransactionReceiptMeta';
import { TransactionReceiptOutput } from './TransactionReceiptOutput';
import { type GetTxReceiptResponse } from '@thor/thorest/transactions';

/**
 * Type for a transaction receipt.
 */
class TransactionReceipt {
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
    readonly outputs: TransactionReceiptOutput[];

    /**
     * The transaction receipt metadata such as block number, block timestamp, etc.
     */
    readonly meta: TransactionReceiptMeta;

    /**
     * Creates a new instance of the class using the provided parameters.
     *
     * @param {number | null} type - The transaction type.
     * @param {bigint} gasUsed - The amount of gas used by the transaction.
     * @param {Address} gasPayer - The address of the account that paid the gas fee.
     * @param {bigint} paid - The amount of energy (VTHO) in wei, used to pay for the gas.
     * @param {bigint} reward - The amount of energy (VTHO) in wei, paid to the block signer as a reward.
     * @param {boolean} reverted - Indicates whether the transaction was reverted (true means reverted).
     * @param {TransactionReceiptOutput[]} outputs - An array of outputs produced by the transaction.
     * @param {TransactionReceiptMeta} meta - The transaction receipt metadata.
     */
    constructor(
        type: number | null,
        gasUsed: bigint,
        gasPayer: Address,
        paid: bigint,
        reward: bigint,
        reverted: boolean,
        outputs: TransactionReceiptOutput[],
        meta: TransactionReceiptMeta
    ) {
        this.type = type;
        this.gasUsed = gasUsed;
        this.gasPayer = gasPayer;
        this.paid = paid;
        this.reward = reward;
        this.reverted = reverted;
        this.outputs = outputs;
        this.meta = meta;
    }

    /**
     * Creates a new instance of the class from the thorest response.
     *
     * @param {GetTxReceiptResponse} response - The transaction receipt response.
     * @returns {TransactionReceipt} A new instance of the class.
     */
    static of(response: GetTxReceiptResponse): TransactionReceipt {
        return new TransactionReceipt(
            response.type,
            response.gasUsed,
            response.gasPayer,
            response.paid,
            response.reward,
            response.reverted,
            response.outputs.map((output) =>
                TransactionReceiptOutput.of(output)
            ),
            TransactionReceiptMeta.of(response.meta)
        );
    }
}

export { TransactionReceipt };
