import { type Address, type Hex } from '@common/vcdm';
import {
    type Clause,
    TransactionReceiptOutput
} from '@thor/thor-client/model/transactions';
import { type TxWithReceipt } from '@thor/thorest/transactions/model';
import { type OutputResponse } from '@thor/thorest/common';

/**
 * A transaction contained in an expanded block.
 */
class BlockTransaction {
    readonly id: Hex;
    readonly type: number | null;
    readonly origin: Address;
    readonly delegator: Address | null;
    readonly size: number;
    readonly chainTag: number;
    readonly blockRef: Hex;
    readonly expiration: number;
    readonly clauses: Clause[];
    readonly gasPriceCoef: bigint | null;
    readonly maxFeePerGas: bigint | null;
    readonly maxPriorityFeePerGas: bigint | null;
    readonly gas: bigint;
    readonly dependsOn: Hex | null;
    readonly nonce: bigint;
    readonly outputs: TransactionReceiptOutput[];

    /**
     * Constructs a new instance of the class from the thorest response.
     *
     * @param {TxWithReceipt} tx - The transaction to construct the instance from.
     */
    private constructor(tx: TxWithReceipt) {
        this.id = tx.id;
        this.type = tx.type;
        this.origin = tx.origin;
        this.delegator = tx.delegator;
        this.size = tx.size;
        this.chainTag = tx.chainTag;
        this.blockRef = tx.blockRef;
        this.expiration = tx.expiration;
        this.clauses = tx.clauses;
        this.gasPriceCoef = tx.gasPriceCoef;
        this.maxFeePerGas = tx.maxFeePerGas;
        this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
        this.gas = tx.gas;
        this.dependsOn = tx.dependsOn;
        this.nonce = tx.nonce;
        this.outputs = tx.outputs.map((output: OutputResponse) =>
            TransactionReceiptOutput.of(output)
        );
    }

    /**
     * Creates a new instance of the class from the thorest response.
     *
     * @param {TxWithReceipt} tx - The transaction to construct the instance from.
     * @returns {BlockTransaction} A new instance of the class.
     */
    static fromThorest(tx: TxWithReceipt): BlockTransaction {
        return new BlockTransaction(tx);
    }
}

export { BlockTransaction };
