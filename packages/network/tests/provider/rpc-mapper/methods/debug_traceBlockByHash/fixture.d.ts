/**
 * debug_traceBlockByHash fixture
 */
declare const debugTraceBlockByHashFixture: {
    input: {
        params: (string | {
            tracer: string;
            tracerConfig: {
                onlyTopCall: boolean;
            };
        })[];
    };
    expected: {
        txHash: string;
        result: {
            from: string;
            gas: string;
            gasUsed: string;
            to: string;
            input: string;
            value: string;
            type: string;
            revertReason: string;
        };
    }[];
}[];
export { debugTraceBlockByHashFixture };
//# sourceMappingURL=fixture.d.ts.map