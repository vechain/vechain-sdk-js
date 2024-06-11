/* --- Input options start --- */

import { type Event, type Transfer } from '../logs';
import { type TransactionClause } from '@vechain/sdk-core';

/**
 * Input options for Blocks module.
 */
interface BlocksModuleOptions {
    /**
     * (Optional) Whether the polling is enabled.
     */
    isPollingEnabled?: boolean;
    /**
     * (Optional) Callback function called when an error occurs.
     */
    onBlockError?: (error: Error) => undefined;
}

/**
 * Options for `waitForBlockCompressed` and  `waitForBlockExpanded` methods.
 */
interface WaitForBlockOptions {
    /**
     * Timeout in milliseconds.
     * After this time, the method will throw an error.
     */
    timeoutMs?: number;
    /**
     * Interval in milliseconds.
     * The method will check the blocks status every `intervalMs` milliseconds.
     */
    intervalMs?: number;
}

/* --- Input options end --- */

/* --- Responses Outputs start --- */

/**
 * BlockDetail is an interface representing detailed information about a blockchain block.
 */
interface BlockDetail {
    /**
     * Unique identifier for the block.
     */
    id: string;

    /**
     * Block number in the blockchain.
     */
    number: number;

    /**
     * Size of the block in bytes.
     */
    size: number;

    /**
     * Identifier of the parent block.
     */
    parentID: string;

    /**
     * Timestamp when the block was created.
     */
    timestamp: number;

    /**
     * Maximum gas limit for transactions in the block.
     */
    gasLimit: number;

    /**
     * Address of the beneficiary (miner) of the block.
     */
    beneficiary: string;

    /**
     * Total gas used by transactions in the block.
     */
    gasUsed: number;

    /**
     * Represents the Accumulated Witness Number (AWN) of the block.
     * It is used when selecting the trunk block in the VeChainThor consensus algorithm.
     *
     * @link see [VeChainThor Trunk](https://docs.vechain.org/introduction-to-vechain/about-the-vechain-blockchain/consensus-deep-dive#meta-transaction-features-3)
     */
    totalScore: number;

    /**
     * Root hash of the transactions in the block.
     */
    txsRoot: string;

    /**
     * Optional features associated with transactions.
     */
    txsFeatures?: number;

    /**
     * Root hash of the state tree after applying transactions.
     */
    stateRoot: string;

    /**
     * Root hash of the receipts of transactions.
     */
    receiptsRoot: string;

    /**
     * Address of the signer or validator for the block.
     */
    signer: string;

    /**
     * Indicates if the block contains a community fund (com).
     */
    com?: boolean;

    /**
     * Indicates if the block is finalized (optional).
     */
    isFinalized?: boolean;

    /**
     * Since there is no computational competition in PoA, the “longest chain” rule does not apply.
     * Instead, we consider the better branch as the one witnessed by more AMs (Authority Master nodes).
     *
     * @link see [VeChainThor Trunk](https://docs.vechain.org/introduction-to-vechain/about-the-vechain-blockchain/consensus-deep-dive#meta-transaction-features-3)
     */
    isTrunk: boolean;
}

/**
 * Type for the compressed block detail.
 * Here we have the transactions as an array of strings.
 */
interface CompressedBlockDetail extends BlockDetail {
    transactions: string[];
}

/**
 * Type for the expanded block detail.
 * Here we have the transactions expanded with the details.
 */
interface ExpandedBlockDetail extends BlockDetail {
    transactions: TransactionsExpandedBlockDetail[];
}

/**
 * Output represents the result or consequence of a blockchain transaction.
 */
interface Output {
    /**
     * address of the contract involved in the clause output.
     */
    contractAddress: string | null;
    /**
     * Events emitted by executing the clause.
     */
    events: Event[];
    /**
     * Transfers of VET or VIP180 tokens that occur from the clause.
     */
    transfers: Transfer[];
}

/**
 * TransactionsExpandedBlockDetail is an interface representing detailed information about transactions in a blockchain block.
 */
interface TransactionsExpandedBlockDetail {
    /**
     * Unique identifier for the transaction.
     */
    id: string;

    /**
     * Chain tag of the blockchain.
     */
    chainTag: string;

    /**
     * Reference to the block.
     */
    blockRef: string;

    /**
     * Expiration timestamp of the transaction.
     */
    expiration: number;

    /**
     * Clauses represent the individual conditions or terms in a blockchain transaction.
     */
    clauses: TransactionClause[];

    /**
     * Gas price coefficient for the transaction.
     */
    gasPriceCoef: number;

    /**
     * Gas limit for the transaction.
     */
    gas: number;

    /**
     * Origin (sender) of the transaction.
     */
    origin: string;

    /**
     * Delegator associated with the transaction.
     */
    delegator: string;

    /**
     * Nonce value for preventing replay attacks.
     */
    nonce: string;

    /**
     * Transaction dependency.
     */
    dependsOn: string;

    /**
     * Size of the transaction in bytes.
     */
    size: number;

    /**
     * Gas used by the transaction.
     */
    gasUsed: number;

    /**
     * Account paying for the gas.
     */
    gasPayer: string;

    /**
     * Amount paid for the transaction.
     */
    paid: string;

    /**
     * Reward associated with the transaction.
     */
    reward: string;

    /**
     * Indicates if the transaction is reverted.
     */
    reverted: boolean;

    /**
     * Outputs represent the results or consequences of a blockchain transaction.
     */
    outputs: Output[];
}

/* --- Responses Outputs end --- */

export {
    type BlocksModuleOptions,
    type BlockDetail,
    type CompressedBlockDetail,
    type ExpandedBlockDetail,
    type TransactionsExpandedBlockDetail,
    type Output,
    type WaitForBlockOptions
};
