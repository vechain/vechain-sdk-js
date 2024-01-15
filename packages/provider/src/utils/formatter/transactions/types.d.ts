/**
 * The return type of a transaction according to the Ethereum RPC standard.
 *
 * @link [Ethereum JSON RPC Transaction Object](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gettransactionbyhash#returns)
 */
interface TransactionReturnTypeRPC {
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
     * The gas provided by the sender, encoded as hexadecimalß
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

export type { TransactionReturnTypeRPC };
