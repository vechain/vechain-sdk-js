/**
 * debug_traceBlockByNumber fixture
 */
declare const debugTraceBlockByNumberFixture: {
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
export { debugTraceBlockByNumberFixture };
//# sourceMappingURL=fixture.d.ts.map