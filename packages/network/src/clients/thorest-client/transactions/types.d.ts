import { type TransactionBody } from '@vechainfoundation/vechain-sdk-core/src';

/**
 * Transaction clause type for transaction simulation having value only string.
 *
 * @public
 */
interface SimulateTransactionClause {
    /**
     * Destination or contract address of the clause.
     */
    to: string | null;
    /**
     * Amount of VET transferred in the clause. Zero value if no VET is transferred and we are
     * performing a smart contract transaction.
     */
    value: string;
    /**
     * Data sent along with the clause. Zero value if no data is sent.
     */
    data: string;
}

/* --- Input options start --- */

/**
 * Input options for:
 * * getTransactionReceipt
 * Methods
 *
 * @public
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
 *
 * @public
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
 *
 * @public
 */
interface SimulateTransactionOptions {
    /**
     * The block number or block ID of which the transaction simulation is based on
     */
    revision?: string;
    /**
     * The address performing the transaction simulation
     */
    caller?: string;
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
 *
 * @private
 */
interface TransactionMetadata {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
    txID?: string;
    txOrigin?: string;
}

/**
 * Type for transaction events.
 *
 * @private
 */
type TransactionEventsType = Array<{
    address: string;
    topics: string[];
    data: string;
}>;

/**
 * Type for transaction transfers.
 *
 * @private
 */
type TransactionTransfersType = Array<{
    sender: string;
    recipient: string;
    amount: string;
}>;
/**
 * Type for RAW transaction detail.
 * It is the response of `getTransaction` with `raw` set to `true`.
 *
 * @private
 */
interface TransactionDetailRaw {
    raw: string;
    meta: Omit<TransactionMetadata, 'txID' | 'txOrigin'>;
}

/**
 * Type for NO RAW transaction detail.
 * It is the response of `getTransaction` with `raw` set to `false`.
 *
 * @private
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
 *
 * @public
 */
type TransactionDetail = TransactionDetailRaw | TransactionDetailNoRaw;

/**
 * Type for transaction receipt.
 *
 * @public
 */
interface TransactionReceipt {
    gasUsed: number;
    gasPayer: string;
    paid: string;
    reward: string;
    reverted: boolean;
    outputs: [
        {
            contractAddress: string | null;
            events: TransactionEventsType;
            transfers: TransactionTransfersType;
        }
    ];
    meta: TransactionMetadata;
}

/**
 * Type for transaction call simulation.
 *
 * @public
 */
type TransactionCallSimulation = [
    {
        data: string;
        events: TransactionEventsType;
        transfers: TransactionTransfersType;
        gasUsed: number;
        reverted: boolean;
        vmError: string;
    }
];

/**
 * Type for transaction send result.
 *
 * @public
 */
interface TransactionSendResult {
    id: string;
}

/**
 * Type for transaction call simulation result.
 *
 * @public
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
