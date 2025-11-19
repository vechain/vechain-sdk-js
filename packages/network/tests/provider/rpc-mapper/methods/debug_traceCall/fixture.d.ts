import { JSONRPCInternalError } from '@vechain/sdk-errors';
/**
 * debug_traceCall positive cases fixture
 */
declare const debugTraceCallPositiveCasesFixtureTestnet: ({
    input: {
        params: (string | {
            from: string;
            to: string;
            value: string;
            data: string;
            gas: string;
            tracer?: undefined;
            tracerConfig?: undefined;
        } | {
            tracer: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
            from?: undefined;
            to?: undefined;
            value?: undefined;
            data?: undefined;
            gas?: undefined;
        })[];
        expected: {
            from: string;
            gas: string;
            gasUsed: string;
            to: string;
            input: string;
            output: string;
            value: string;
            type: string;
            revertReason: string;
            error?: undefined;
        };
    };
} | {
    input: {
        params: (string | {
            from: string;
            to: null;
            data: string;
            tracer?: undefined;
            tracerConfig?: undefined;
        } | {
            tracer: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
            from?: undefined;
            to?: undefined;
            data?: undefined;
        })[];
        expected: {
            from: string;
            gas: string;
            gasUsed: string;
            input: string;
            error: string;
            value: string;
            type: string;
            revertReason: string;
            to?: undefined;
            output?: undefined;
        };
    };
})[];
/**
 * debug_traceCall negative cases fixture
 */
declare const debugTraceCallNegativeCasesFixtureTestnet: {
    input: {
        params: (string | {
            from: string;
            to: string;
            value: string;
            data: string;
            tracer?: undefined;
            tracerConfig?: undefined;
        } | {
            tracer: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
            from?: undefined;
            to?: undefined;
            value?: undefined;
            data?: undefined;
        })[];
        expectedError: typeof JSONRPCInternalError;
    };
}[];
export { debugTraceCallPositiveCasesFixtureTestnet, debugTraceCallNegativeCasesFixtureTestnet };
//# sourceMappingURL=fixture.d.ts.map