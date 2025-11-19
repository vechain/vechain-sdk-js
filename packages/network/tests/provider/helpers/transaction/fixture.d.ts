/**
 * Test cases for getTransactionIndex
 */
declare const getTransactionIndexTestCases: ({
    block: {
        hash: string;
        parentHash: string;
        number: string;
        size: string;
        stateRoot: string;
        receiptsRoot: string;
        transactionsRoot: string;
        timestamp: string;
        gasLimit: string;
        gasUsed: string;
        transactions: {
            blockHash: string;
            blockNumber: string;
            from: string;
            gas: string;
            chainId: string;
            hash: string;
            nonce: string;
            transactionIndex: string;
            input: string;
            to: string;
            value: string;
            gasPrice: string;
            type: string;
            v: string;
            r: string;
            s: string;
            accessList: never[];
            maxFeePerGas: undefined;
            maxPriorityFeePerGas: undefined;
            yParity: string;
        }[];
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        uncles: never[];
        sha3Uncles: string;
        nonce: string;
        logsBloom: string;
        extraData: string;
        baseFeePerGas: undefined;
        mixHash: string;
    };
    hash: string;
    expected: number;
} | {
    block: {
        hash: string;
        parentHash: string;
        number: string;
        size: string;
        stateRoot: string;
        receiptsRoot: string;
        transactionsRoot: string;
        timestamp: string;
        gasLimit: string;
        gasUsed: string;
        transactions: string[];
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        uncles: never[];
        sha3Uncles: string;
        nonce: string;
        logsBloom: string;
        extraData: string;
        baseFeePerGas: undefined;
        mixHash: string;
    };
    hash: string;
    expected: number;
})[];
/**
 * Test cases for getTransactionIndex with invalid data
 */
declare const invalidGetTransactionIndexTestCases: ({
    block: {
        hash: string;
        parentHash: string;
        number: string;
        size: string;
        stateRoot: string;
        receiptsRoot: string;
        transactionsRoot: string;
        timestamp: string;
        gasLimit: string;
        gasUsed: string;
        transactions: {
            blockHash: string;
            blockNumber: string;
            from: string;
            gas: string;
            chainId: string;
            hash: string;
            nonce: string;
            transactionIndex: string;
            input: string;
            to: string;
            value: string;
            gasPrice: string;
            type: string;
            v: string;
            r: string;
            s: string;
            accessList: never[];
            maxFeePerGas: undefined;
            maxPriorityFeePerGas: undefined;
            yParity: string;
        }[];
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        uncles: never[];
        sha3Uncles: string;
        nonce: string;
        logsBloom: string;
        extraData: string;
        baseFeePerGas: undefined;
        mixHash: string;
    };
    hash: string;
} | {
    block: {
        hash: string;
        parentHash: string;
        number: string;
        size: string;
        stateRoot: string;
        receiptsRoot: string;
        transactionsRoot: string;
        timestamp: string;
        gasLimit: string;
        gasUsed: string;
        transactions: string[];
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        uncles: never[];
        sha3Uncles: string;
        nonce: string;
        logsBloom: string;
        extraData: string;
        baseFeePerGas: undefined;
        mixHash: string;
    };
    hash: string;
})[];
export { getTransactionIndexTestCases, invalidGetTransactionIndexTestCases };
//# sourceMappingURL=fixture.d.ts.map