import type { TransactionBody, TransactionClause } from '@vechain/sdk-core';
import type { Output } from '../blocks';
import { type Transfer } from '../logs';

/**
 * Transaction clause type for transaction simulation having value only string.
 */
type SimulateTransactionClause = TransactionClause;

/* --- Input options start --- */

/**
 * Options for `waitForTransaction` method.
 */
interface WaitForTransactionOptions {
    /**
     * Timeout in milliseconds.
     * After this time, the method will throw an error.
     */
    timeoutMs?: number;
    /**
     * Interval in milliseconds.
     * The method will check the transaction status every `intervalMs` milliseconds.
     */
    intervalMs?: number;
}

/**
 * Options for `buildTransactionBody` method.
 */
interface TransactionBodyOptions {
    /**
     * 8 bytes prefix of some block's ID
     */
    blockRef?: string;

    /**
     * Last byte of genesis block ID
     */
    chainTag?: number;

    /**
     * The ID of the transaction that this transaction depends on.
     */
    dependsOn?: string;

    /**
     * The expiration time of the transaction.
     * The transaction will expire after the number of blocks specified by this value.
     */
    expiration?: number;

    /**
     * Coefficient used to calculate the gas price for the transaction.
     * Value must be between 0 and 255.
     */
    gasPriceCoef?: number;

    /**
     * Whether the transaction is delegated to another account for gas payment.
     */
    isDelegated?: boolean;

    /**
     * Nonce value for various purposes.
     * Basic is to prevent replay attack by make transaction unique.
     * Every transaction with same chainTag, blockRef, ... must have different nonce.
     */
    nonce?: string | number;
}

/**
 * Options for `signTransaction` method.
 */
type SignTransactionOptions =
    | { delegatorUrl: string; delegatorPrivateKey?: never }
    | { delegatorPrivateKey: string; delegatorUrl?: never };

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
    gas?: string | number;
    /**
     * The price of gas for the transaction simulation
     */
    gasPrice?: string;
    /**
     * The caller of the transaction simulation. (i.e., the address that performs the transaction)
     */
    caller?: string;

    // ------ START: EXTENDED EVM CONTEXT OPTIONS ------ //

    /*
        The following options are useful when simulating transactions that provide additional context to the EVM.
        The additional context is handled by the built-in Extension-V2 Smart contract (https://docs.vechain.org/developer-resources/built-in-contracts#extension-v2-sol)

        The contract allows for smart contract developers to obtain additional context about the transaction in their smart contract code, for example:
        - The expiration of the transaction
        - The block reference of the transaction
        - The gas payer of the transaction
        - The proved work of the transaction (https://docs.vechain.org/core-concepts/transactions/transaction-calculation#proof-of-work)
    */

    /**
     * The VeChainThor blockchain allows for transaction-level proof of work (PoW) and converts the proved work into extra gas price that will be used by
     * the system to generate more reward to the block generator, the Authority Master node, that validates the transaction.
     * In other words, users can utilize their local computational power to make their transactions more likely to be included in a new block.
     *
     * @link [VeChainThor Proof of Work](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#proof-of-work)
     */
    provedWork?: string;
    /**
     * The address that pays for the gas fee of the transaction simulation.
     * If different from the caller, then a delegated transaction is simulated.
     */
    gasPayer?: string;
    /**
     * The expiration of the transaction simulation.
     * Represents how long, in terms of the number of blocks, the transaction will be allowed to be mined in VeChainThor
     */
    expiration?: number;
    /**
     * BlockRef stores the reference to a particular block whose next block is the earliest block the current transaction can be included.
     *
     * @link [VeChainThor BlockRef](https://docs.vechain.org/core-concepts/transactions/meta-transaction-features/controllable-transaction-lifecycle)
     */
    blockRef?: string;

    // ------ END: EXTENDED EVM CONTEXT OPTIONS ------ //
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * Represents the result of sending a transaction.
 *
 * @interface SendTransactionResult
 */
interface SendTransactionResult {
    /**
     * The unique identifier associated with the transaction.
     *
     * @type {string}
     */
    id: string;

    wait: () => Promise<TransactionReceipt | null>;
}

/**
 * Represents the result of getting a delegation signature.
 */
interface GetDelegationSignatureResult {
    /**
     * The signature of the transaction.
     */
    signature: string;
}

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

export type {
    WaitForTransactionOptions,
    TransactionBodyOptions,
    SignTransactionOptions,
    GetDelegationSignatureResult,
    SendTransactionResult,
    GetTransactionInputOptions,
    GetTransactionReceiptInputOptions,
    TransactionReceipt,
    TransactionSimulationResult,
    SimulateTransactionClause,
    SimulateTransactionOptions,
    TransactionDetailRaw,
    TransactionDetailNoRaw
};
