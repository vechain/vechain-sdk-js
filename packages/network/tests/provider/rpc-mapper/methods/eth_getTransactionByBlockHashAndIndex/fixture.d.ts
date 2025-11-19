import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Positive test cases for eth_getTransactionByBlockHashAndIndex
 */
declare const ethGetTransactionByBlockHashAndIndexTestCases: ({
    description: string;
    params: string[];
    expected: {
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
    };
} | {
    description: string;
    params: string[];
    expected: null;
})[];
/**
 * Negative test cases for eth_getTransactionByBlockHashAndIndex
 */
declare const invalidEthGetTransactionByBlockHashAndIndexTestCases: {
    description: string;
    params: (string | number)[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { ethGetTransactionByBlockHashAndIndexTestCases, invalidEthGetTransactionByBlockHashAndIndexTestCases };
//# sourceMappingURL=fixture.d.ts.map