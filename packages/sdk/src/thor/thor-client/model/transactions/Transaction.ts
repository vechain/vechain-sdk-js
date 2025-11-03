import { type Address, type Hex } from '@common/vcdm';
import { Clause } from './Clause';
import { TransactionMeta } from './TransactionMeta';
import { type GetTxResponse } from '@thor/thorest/transactions';

/**
 * Class representing a transaction read from the blockchain.
 */
class Transaction {
    /**
     * The transaction identifier.
     */
    readonly id: Hex;

    /**
     * The transaction type
     */
    readonly type: number | null;

    /**
     * The address of the origin account.
     */
    readonly origin: Address;

    /**
     * The address of the sponsor / delegator account.
     */
    readonly delegator: Address | null;

    /**
     * Byte size of the transaction that is RLP encoded.
     */
    readonly size: number;

    /**
     * The last byte of the genesis block ID.
     */
    readonly chainTag: number;

    /**
     * The first 8 bytes of a referenced block ID.
     */
    readonly blockRef: Hex;

    /**
     * The expiration of the transaction, represented as the number of blocks after the `blockRef`.
     */
    readonly expiration: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    readonly clauses: Clause[];

    /**
     * For legacy type transactions, the coefficient used to calculate the final gas price of the transaction.
     */
    readonly gasPriceCoef: bigint | null;

    /**
     * The maximum amount that can be spent to pay for base fee and priority fee expressed in hex.
     */
    readonly maxFeePerGas: bigint | null;

    /**
     * The maximum amount that can be tipped to the validator expressed in hex.
     */
    readonly maxPriorityFeePerGas: bigint | null;

    /**
     * The max amount of gas that was be used by the transaction.
     */
    readonly gas: bigint;

    /**
     * The transaction Id that this transaction depends on.
     */
    readonly dependsOn: Hex | null;

    /**
     * The transaction nonce.
     */
    readonly nonce: bigint; // hex int

    /**
     * Transaction metadata such as block number, block timestamp, etc.
     */
    readonly meta: TransactionMeta | null;

    /**
     * Creates a new Transaction instance.
     * @param data - The GetTxResponse to create the Transaction from.
     */
    constructor(data: GetTxResponse) {
        this.id = data.id;
        this.type = data.type;
        this.origin = data.origin;
        this.delegator = data.delegator;
        this.size = data.size;
        this.chainTag = data.chainTag;
        this.blockRef = data.blockRef;
        this.expiration = data.expiration;
        this.clauses = data.clauses.map((clause) => Clause.of(clause));
        this.gasPriceCoef = data.gasPriceCoef;
        this.maxFeePerGas = data.maxFeePerGas;
        this.maxPriorityFeePerGas = data.maxPriorityFeePerGas;
        this.gas = data.gas;
        this.dependsOn = data.dependsOn;
        this.nonce = data.nonce;
        this.meta = data.meta !== null ? new TransactionMeta(data.meta) : null;
    }
}

export { Transaction };
