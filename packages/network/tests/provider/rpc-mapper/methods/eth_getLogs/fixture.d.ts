/**
 * Fixtures for eth_getLogs positive cases
 */
declare const logsFixture: ({
    input: {
        address: string[];
        fromBlock: string;
        toBlock: string;
        topics: string[];
    };
    expected: {
        transactionHash: string;
        blockHash: string;
        blockNumber: string;
        address: string;
        data: string;
        topics: string[];
        removed: boolean;
        logIndex: string;
        transactionIndex: string;
    }[];
} | {
    input: {
        address: null;
        fromBlock: string;
        toBlock: string;
        topics: string[];
    };
    expected: {
        transactionHash: string;
        blockHash: string;
        blockNumber: string;
        address: string;
        data: string;
        topics: string[];
        removed: boolean;
        logIndex: string;
        transactionIndex: string;
    }[];
})[];
/**
 * Fixtures for eth_getLogs mocked positive cases
 */
declare const mockLogsFixture: ({
    input: {
        address: string[];
        topics: string[];
        fromBlock: string;
        toBlock: string;
    };
    expected: never[];
} | {
    input: {
        address: string[];
        fromBlock: string;
        toBlock: string;
        topics?: undefined;
    };
    expected: never[];
} | {
    input: {
        topics: string[];
        fromBlock: string;
        toBlock: string;
        address?: undefined;
    };
    expected: never[];
} | {
    input: {
        address: string;
        topics?: undefined;
        fromBlock?: undefined;
        toBlock?: undefined;
    };
    expected: never[];
})[];
export { logsFixture, mockLogsFixture };
//# sourceMappingURL=fixture.d.ts.map