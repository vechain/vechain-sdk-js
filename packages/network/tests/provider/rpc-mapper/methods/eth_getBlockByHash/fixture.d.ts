import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Test cases for eth_getBlockByHash RPC method
 */
declare const ethGetBlockByHashTestCases: ({
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
    expectedTransactionsLength: number;
} | {
    description: string;
    params: (string | boolean)[];
    expected: null;
    expectedTransactionsLength: number;
})[];
/**
 * Invalid eth_getBlockByHash RPC method test cases
 */
declare const invalidEthGetBlockByHashTestCases: ({
    description: string;
    params: (string | boolean)[];
    expectedError: typeof JSONRPCInvalidParams;
} | {
    description: string;
    params: (number | boolean)[];
    expectedError: typeof JSONRPCInvalidParams;
})[];
export { ethGetBlockByHashTestCases, invalidEthGetBlockByHashTestCases };
//# sourceMappingURL=fixture.d.ts.map