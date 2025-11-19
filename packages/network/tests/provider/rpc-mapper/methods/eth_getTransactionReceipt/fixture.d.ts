import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Fixture for eth_getTransactionReceipt correct cases for solo network
 */
declare const getReceiptCorrectCasesSoloNetwork: {
    testCase: string;
    hash: string;
    expected: {
        blockHash: string;
        blockNumber: string;
        contractAddress: null;
        cumulativeGasUsed: string;
        effectiveGasPrice: string;
        from: string;
        gasUsed: string;
        logs: {
            address: string;
            blockHash: string;
            blockNumber: string;
            data: string;
            logIndex: string;
            removed: boolean;
            topics: string[];
            transactionHash: string;
            transactionIndex: string;
        }[];
        logsBloom: string;
        status: string;
        to: string;
        transactionHash: string;
        transactionIndex: string;
        type: string;
    };
}[];
/**
 * Fixture for eth_getTransactionReceipt correct cases for test network
 */
declare const getReceiptCorrectCasesTestNetwork: ({
    testCase: string;
    hash: string;
    expected: {
        blockHash: string;
        blockNumber: string;
        contractAddress: null;
        cumulativeGasUsed: string;
        effectiveGasPrice: string;
        from: string;
        gasUsed: string;
        logs: {
            address: string;
            blockHash: string;
            blockNumber: string;
            data: string;
            logIndex: string;
            removed: boolean;
            topics: string[];
            transactionHash: string;
            transactionIndex: string;
        }[];
        logsBloom: string;
        status: string;
        to: string;
        transactionHash: string;
        transactionIndex: string;
        type: string;
    };
} | {
    testCase: string;
    hash: string;
    expected: null;
})[];
/**
 * Fixture for eth_getTransactionReceipt incorrect cases for test network
 */
declare const getReceiptIncorrectCasesTestNetwork: {
    testCase: string;
    params: string[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { getReceiptCorrectCasesSoloNetwork, getReceiptCorrectCasesTestNetwork, getReceiptIncorrectCasesTestNetwork };
//# sourceMappingURL=fixture.d.ts.map