/**
 * Basic transaction types for the contracts module integration
 */

export interface TransactionReceipt {
    transactionHash: string;
    blockNumber: number;
    blockHash: string;
    contractAddress?: string;
    gasUsed: bigint;
    status: 'success' | 'reverted';
}

export interface SendTransactionResult {
    transactionId: string;
    signer: string;
}

export interface SimulateTransactionOptions {
    revision?: string | number;
    gas?: number;
    gasPrice?: string;
    caller?: string;
}

export interface SignTransactionOptions {
    delegationUrl?: string;
}

export interface TransactionBodyOptions {
    gas?: number;
    gasPrice?: string;
    expiration?: number;
    blockRef?: string;
    nonce?: string;
}
