import { type TransactionRPC } from '../transactions/types';

/**
 * Return type of block header for RPC standard.
 */
interface BlockHeaderRPC {
    /**
     * Header number in hex string format
     */
    number: string;

    /**
     * Hash in bytes32 format
     */
    hash: string;

    /**
     * Parent hash in bytes32 format
     */
    parentHash: string;

    /**
     * Transactions root in bytes32 format
     */
    transactionsRoot: string;

    /**
     * State root in bytes32 format
     */
    stateRoot: string;
    /**
     * Receipts root in bytes32 format
     */
    receiptsRoot: string;

    /**
     * Miner address in bytes20 format
     */
    miner: string;

    /**
     * Gas limit in hex string format
     */
    gasLimit: string;

    /**
     * Gas used in hex string format
     */
    gasUsed: string;

    /**
     * Timestamp in hex string format
     */
    timestamp: string;

    /**
     * Unsupported fields
     */
    sha3Uncles: string;
    nonce: string;
    logsBloom: string;
    extraData: string;
}

/**
 * Return type of blocks for RPC standard.
 *
 * Our SDK uses `BlockDetail` type from `@vechain/sdk-network` package.
 *
 * @link [Ethereum JSON RPC Block Object](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getblockbynumber#returns)
 */
interface BlocksRPC extends BlockHeaderRPC {
    /**
     * Block number in hex string format
     */
    size: string;

    /**
     * List of transactions as bytes32 array or TransactionRPC array
     */
    transactions: string[] | TransactionRPC[];

    /**
     * Base fee per gas in hex string format (since the Galactica fork)
     */
    baseFeePerGas?: string;

    /**
     * Unsupported fields
     */
    difficulty: string;
    totalDifficulty: string;
    uncles: string[];
    mixHash: string;
}

/**
 * Return type of eth_syncing for RPC method.
 */
interface SyncBlockRPC {
    startingBlock: null;
    currentBlock: BlocksRPC | null;
    highestBlock: string | null;
}

export { type BlockHeaderRPC, type BlocksRPC, type SyncBlockRPC };
