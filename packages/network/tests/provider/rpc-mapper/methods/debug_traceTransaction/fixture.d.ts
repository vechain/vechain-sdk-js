import { InvalidDataType, JSONRPCInternalError } from '@vechain/sdk-errors';
/**
 * debug_traceTransaction positive cases fixture - Testnet
 */
declare const debugTraceTransactionPositiveCasesFixtureTestnet: {
    input: {
        params: (string | {
            tracer: string;
            timeout: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
        })[];
        expected: {
            from: string;
            gas: string;
            gasUsed: string;
            to: string;
            input: string;
            value: string;
            type: string;
            revertReason: string;
        };
    };
}[];
/**
 * debug_traceTransaction positive cases fixture.
 */
declare const debugTraceTransactionNegativeCasesFixtureTestnet: ({
    input: {
        params: (string | {
            tracer: string;
            timeout: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
        })[];
        expectedError: typeof InvalidDataType;
    };
} | {
    input: {
        params: (string | {
            tracer: string;
            timeout: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
        })[];
        expectedError: typeof JSONRPCInternalError;
    };
})[];
export { debugTraceTransactionPositiveCasesFixtureTestnet, debugTraceTransactionNegativeCasesFixtureTestnet };
//# sourceMappingURL=fixture.d.ts.map