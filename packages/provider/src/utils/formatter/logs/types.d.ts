/**
 * Return type of logs according to the Ethereum RPC standard.
 */
interface LogsRPC {
    /**
     * (boolean) true when the log was removed, due to a chain reorganization. false if it's a valid log.
     */
    removed: boolean;

    /**
     * Hexadecimal of the log index position in the block. Null when it is a pending log.
     */
    logIndex: string;

    /**
     * Hexadecimal of the transaction index position from which the log created. Null when it is a pending log.
     */
    transactionIndex: string;

    /**
     * 32 bytes. Hash of the transactions from which this log was created. Null when it is a pending log.
     */
    transactionHash: string;

    /**
     * 32 bytes. Hash of the block where this log was in. Null when it is a pending log.
     */
    blockHash: string;

    /**
     * Block number where this log was in. Null when it is a pending log.
     */
    blockNumber: string;

    /**
     * 20 bytes. Address from which this log originated.
     */
    address: string;

    /**
     * Contains one or more 32-bytes non-indexed arguments of the log.
     */
    data: string;

    /**
     * An array of 0 to 4 indexed log arguments, each 32 bytes. In solidity the first topic is the hash of the signature of the event (e.g. Deposit(address,bytes32,uint256)), except when you declared the event with the anonymous specifier.
     */
    topics: string[];
}

export { type LogsRPC };
