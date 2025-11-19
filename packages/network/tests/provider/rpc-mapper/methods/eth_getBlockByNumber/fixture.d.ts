import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Zero block fixture
 */
declare const zeroBlock: {
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
    transactions: never[];
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
/**
 * Test cases for eth_getBlockByNumber RPC method
 */
declare const ethGetBlockByNumberTestCases: ({
    description: string;
    params: (string | boolean)[];
    expected: {
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
} | {
    description: string;
    params: (string | boolean)[];
    expected: {
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
})[];
/**
 * Invalid eth_getBlockByNumber RPC method test cases
 */
declare const invalidEthGetBlockByNumberTestCases: ({
    description: string;
    params: (string | boolean)[];
    expectedError: typeof JSONRPCInvalidParams;
} | {
    description: string;
    params: (number | boolean)[];
    expectedError: typeof JSONRPCInvalidParams;
})[];
export { zeroBlock, ethGetBlockByNumberTestCases, invalidEthGetBlockByNumberTestCases };
//# sourceMappingURL=fixture.d.ts.map