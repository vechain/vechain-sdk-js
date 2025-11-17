import { type Address, type Hex } from '@common/vcdm';
import { TransactionMeta } from './TransactionMeta';
import { type GetTxResponse } from '@thor/thorest/transactions';
import { BaseTransaction, type BaseTransactionParams } from './BaseTransaction';

/**
 * Class representing a transaction read from the blockchain.
 */
class Transaction extends BaseTransaction {
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
     * Transaction metadata such as block number, block timestamp, etc.
     */
    readonly meta: TransactionMeta | null;
    /**
     * Creates a new Transaction instance.
     * @param data - The GetTxResponse to create the Transaction from.
     */
    constructor(data: GetTxResponse) {
        super({
            chainTag: data.chainTag,
            blockRef: data.blockRef,
            expiration: data.expiration,
            clauses: data.clauses,
            gas: data.gas,
            gasPriceCoef: data.gasPriceCoef ?? undefined,
            maxFeePerGas: data.maxFeePerGas ?? undefined,
            maxPriorityFeePerGas: data.maxPriorityFeePerGas ?? undefined,
            dependsOn: data.dependsOn,
            nonce: data.nonce
        } satisfies BaseTransactionParams);
        this.id = data.id;
        this.type = data.type;
        this.origin = data.origin;
        this.delegator = data.delegator;
        this.size = data.size;
        this.meta = data.meta !== null ? new TransactionMeta(data.meta) : null;
    }
}

export { Transaction };
