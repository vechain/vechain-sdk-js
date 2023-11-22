import { type TransactionBody } from '@vechainfoundation/vechain-sdk-core/src';
import { type Output, type Clause } from '../blocks';

/**
 * Transaction clause type for transaction simulation having value only string.
 */
type SimulateTransactionClause = Clause;

/* --- Input options start --- */

/**
 * Input options for:
 * * getTransactionReceipt
 * Methods
 */
interface GetTransactionReceiptInputOptions {
    /**
     * (Optional) The block number or ID to reference the transaction.
     */
    head?: string;
}

/**
 * Input options for:
 * * getTransaction
 * Methods
 */
type GetTransactionInputOptions = GetTransactionReceiptInputOptions & {
    /**
     * (Optional) If true, returns the raw transaction data instead of the parsed transaction object.
     */
    raw?: boolean;

    /**
     * (Optional) If true, returns the pending transaction details instead of the final transaction details.
     */
    pending?: boolean;
};

/**
 * Type for transaction simulation options.
 */
interface SimulateTransactionOptions {
    /**
     * The block number or block ID of which the transaction simulation is based on
     */
    revision?: string;
    /**
     * The offered gas for the transaction simulation
     */
    gas?: number;
    /**
     * The price of gas for the transaction simulation
     */
    gasPrice?: string;
    /**
     * The caller of the transaction simulation. (i.e., the address that performs the transaction)
     */
    caller?: string;
    /**
     * The VechainThor blockchain allows for transaction-level proof of work (PoW) and converts the proved work into extra gas price that will be used by
     * the system to generate more reward to the block generator, the Authority Masternode, that validates the transaction.
     * In other words, users can utilize their local computational power to make their transactions more likely to be included in a new block.
     *
     * @link [VechainThor Proof of Work](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#proof-of-work)
     */
    provedWork?: string;
    /**
     * The address that pays for the gas fee of the transaction simulation.
     * If different from the caller, then a delegated transaction is simulated.
     */
    gasPayer?: string;
    /**
     * The expiration of the transaction simulation.
     * Represents how long, in terms of the number of blocks, the transaction will be allowed to be mined in VechainThor
     */
    expiration?: number;
    /**
     * BlockRef stores the reference to a particular block whose next block is the earliest block the current transaction can be included.
     *
     * @link [VechainThor BlockRef](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/controllable-transaction-lifecycle)
     */
    blockRef?: string;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * Transaction Metadata interface.
 */
interface TransactionMetadata {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
    txID?: string;
    txOrigin?: string;
}

/**
 * Type for RAW transaction detail.
 * It is the response of `getTransaction` with `raw` set to `true`.
 */
interface TransactionDetailRaw {
    /**
     * Raw data
     */
    raw: string;
    /**
     * Transaction meta data
     */
    meta: Omit<TransactionMetadata, 'txID' | 'txOrigin'>;
}

/**
 * Type for NO RAW transaction detail.
 * It is the response of `getTransaction` with `raw` set to `false`.
 */
type TransactionDetailNoRaw = TransactionBody & {
    id: string;
    origin: string;
    delegator: string | null;
    size: number;
    meta: TransactionMetadata;
};

/**
 * Type for transaction detail.
 */
type TransactionDetail = TransactionDetailRaw | TransactionDetailNoRaw;

/**
 * Type for transaction receipt.
 */
interface TransactionReceipt {
    /**
     * Gas used in the transaction
     */
    gasUsed: number;
    /**
     * For delegated transactions the gas payer
     * */
    gasPayer: string;
    /**
     * Energy paid for used gas
     */
    paid: string;
    /**
     * Energy reward given to block proposer
     */
    reward: string;
    /**
     * If the transaction has been reverted
     */
    reverted: boolean;
    /**
     * Outputs of the transaction, e.g. contract, events, transfers
     */
    outputs: Output[];
    /**
     * Data associated with the transaction e.g. blockID, blockNumber, txID
     */
    meta: TransactionMetadata;
}

/**
 * Type for transaction call simulation.
 */
type TransactionCallSimulation = [
    {
        /**
         * Returned data from the simulation
         */
        data: string;
        /**
         * Events from the siluation
         */
        events: TransactionEventsType;
        /**
         * Details of transfers from the simulation
         */
        transfers: TransactionTransfersType;
        /**
         * Gas used from the simulation
         */
        gasUsed: number;
        /**
         * If the transaction would be reverted
         */
        reverted: boolean;
        /**
         * Details of any VM errors
         */
        vmError: string;
    }
];

/**
 * Type for transaction send result.
 */
interface TransactionSendResult {
    /**
     * Transaction id
     */
    id: string;
}

/**
 * Type for transaction call simulation result.
 */
interface TransactionSimulationResult {
    /**
     * Data returned from the transaction simulation
     */
    data: string;
    /**
     * Events emitted from the transaction simulation
     */
    events: Event[];
    /**
     * Transfers that occur from the transaction simulation
     */
    transfers: Transfer[];
    /**
     * Gas used from the transaction simulation
     */
    gasUsed: number;
    /**
     * Boolean indicating if the transaction simulation reverted
     */
    reverted: boolean;
    /**
     * Error message from the transaction simulation if it reverted
     */
    vmError: string;
}

/* --- Responses Outputs end --- */

export {
    type GetTransactionInputOptions,
    type GetTransactionReceiptInputOptions,
    type TransactionReceipt,
    type TransactionDetail,
    type TransactionCallSimulation,
    type TransactionSendResult,
    type TransactionSimulationResult,
    type SimulateTransactionClause,
    type SimulateTransactionOptions
};
