/**
 * Fixtures for the `eth_getBlockReceipts` RPC method.
 *
 * This fixtures are used to test the `eth_getBlockReceipts` RPC method to
 * test positive cases.
 */
declare const blockReceiptsFixture: {
    blockNumber: string;
    expected: {
        blockHash: string;
        blockNumber: string;
        contractAddress: null;
        from: string;
        gasUsed: string;
        logs: {
            blockHash: string;
            blockNumber: string;
            transactionHash: string;
            address: string;
            topics: string[];
            data: string;
            removed: boolean;
            transactionIndex: string;
            logIndex: string;
        }[];
        status: string;
        to: string;
        transactionHash: string;
        transactionIndex: string;
        logsBloom: string;
        cumulativeGasUsed: string;
        effectiveGasPrice: string;
        type: string;
    }[];
}[];
/**
 * Negative test cases for the `eth_getBlockReceipts` RPC method.
 *
 * This fixtures are used to test the `eth_getBlockReceipts` RPC method to
 * test negative cases.
 */
declare const blockReceiptsInvalidFixture: ({
    blockNumber: string;
} | {
    blockNumber: null;
} | {
    blockNumber?: undefined;
})[];
/**
 * Block hash for testing ethGetBlockReceipts with a specific block hash
 */
declare const blockHashReceiptsFixture: {
    blockHash: string;
};
export { blockReceiptsFixture, blockHashReceiptsFixture, blockReceiptsInvalidFixture };
//# sourceMappingURL=fixture.d.ts.map