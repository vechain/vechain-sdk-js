/**
 * Return type of block header for RPC standard.
 */
interface HeaderReturnTypeRPC {
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
    sha3Uncles: ZeroBytes32;
    nonce: ZeroBytes8;
    logsBloom: ZeroBytes256;
    extraData: '0x';
}

/**
 * Return type of blocks for RPC standard.
 *
 * Our SDK uses `BlockDetail` type from `@vechainfoundation/vechain-sdk-network` package.
 */
interface BlocksReturnTypeRPC extends HeaderReturnTypeRPC {
    /**
     * Block number in hex string format
     */
    size: string;

    /**
     * List of transactions as bytes32 array
     */
    transactions: string[];

    /**
     * Unsupported fields
     */
    difficulty: '0x0';
    totalDifficulty: '0x0';
    uncles: [];
    baseFeePerGas: '0x0';
}

export { type HeaderReturnTypeRPC, type BlocksReturnTypeRPC };
