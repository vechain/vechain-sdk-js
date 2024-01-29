/**
 * The return type of transaction according to the Ethereum RPC standard.
 *
 * @link [Ethereum JSON RPC Transaction Object](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionbyhash#returns)
 */
interface TransactionRPC {
    /**
     * Hash of the transaction.
     */
    hash: string;
    /**
     * Hash of the block where this transaction is included.
     */
    blockHash: string;
    /**
     * Number of the block where this transaction is included.
     */
    blockNumber: string;
    /**
     * Address of the sender of this transaction.
     */
    from: string;
    /**
     * The address of the receiver. null when it's a contract creation transaction
     */
    to: string | null;
    /**
     * The value transferred in wei encoded as hexadecimal
     */
    value: string;
    /**
     * The gas provided by the sender, encoded as hexadecimal
     */
    gas: string;
    /**
     * The data sent along with the transaction
     */
    input: string;
    /**
     * The integer of the transaction's index position that the log was created from. null when it's a pending log
     */
    transactionIndex: string;
    /**
     * The chain id of the transaction
     */
    chainId: string;
    /**
     * The nonce of the transaction.
     *
     * @note Differs from Ethereum as it's not the sequential nonce.
     */
    nonce: string;

    // incompatible fields
    r: string;
    s: string;
    v: string;
    type: string;
    gasPrice: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    accessList: Array<{ address: string; storageKeys: string[] }>;
    yParity: string;
}

/**
 * The return type of transaction receipt logs according to the Ethereum RPC standard.
 *
 * @link [Ethereum JSON RPC Transaction Receipt Log Object](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionreceipt#returns)
 */
interface TransactionReceiptLogsRPC {
    /**
     * The address from which this log was generated
     */
    address: string;

    /**
     * The hash of the block where this log was in
     */
    blockHash: string;

    /**
     * The block number where this log was in
     */
    blockNumber: string;

    /**
     * The 32 byte non-indexed argument of the log
     */
    data: string;

    /**
     * The integer of log index position in the block encoded as hexadecimal. null if the log is pending
     */
    logIndex: string;

    /**
     * It is true if log was removed, due to a chain reorganization and false if it's a valid log
     */
    removed: false;

    /**
     * An array of zero to four 32 Bytes DATA of indexed log arguments.
     * In Solidity, the first topic is the hash of the signature of the event (e.g. Deposit(address, bytes32, uint256)),
     * except you declare the event with the anonymous specifier
     */
    topics: string[];

    /**
     * The hash of the transaction from which this log was created from. null if the log is pending
     */
    transactionHash: string;

    /**
     * The transactions index position from which this log was created from. null if the log is pending
     */
    transactionIndex: string;
}

/**
 * Return type of transaction receipt according to the Ethereum RPC standard.
 *
 * @link [Ethereum JSON RPC Transaction Receipt Object](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionreceipt#returns)
 */
interface TransactionReceiptRPC {
    /**
     * 32 bytes. Hash of the block including this transaction.
     */
    blockHash: string;
    /**
     * Block number including this transaction.
     */
    blockNumber: string;

    /**
     * 20 bytes. The address of the contract created, if the transaction was a contract creation, otherwise null.
     */
    contractAddress: string | null;

    /**
     * The total amount of gas used when this transaction was executed in the block.
     */
    cumulativeGasUsed: string;

    /**
     * The actual value per gas deducted from the sender's account. Before EIP-1559, equal to the gas price.
     */
    effectiveGasPrice: string;

    /**
     * 20 bytes. The address of the sender.
     */
    from: string;

    /**
     * The total amount of gas used when this transaction was executed in the block.
     */
    gasUsed: string;

    /**
     * Array of log objects, which this transaction generated.
     */
    logs: TransactionReceiptLogsRPC[];

    /**
     * 256 bytes. Bloom filter for light clients to quickly retrieve related logs.
     */
    logsBloom: string;

    /**
     *  Either 1 (success) or 0 (failure)
     */
    status: '0x0' | '0x1';

    /**
     * 20 bytes. The address of the receiver. null when it's a contract creation transaction
     */
    to: string | null;

    /**
     * 32 bytes. Hash of the transaction.
     */
    transactionHash: string;

    /**
     * Hexadecimal of the transaction's index position in the block.
     */
    transactionIndex: string;

    /**
     * The transaction type.
     * @see https://docs.infura.io/networks/ethereum/concepts/transaction-types
     */
    type: '0x0' | '0x1' | '0x2';
}

export {
    type TransactionRPC,
    type TransactionReceiptLogsRPC,
    type TransactionReceiptRPC
};
