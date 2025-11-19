/**
 * Fixtures for delegation handler
 */
declare const delegationHandlerFixture: ({
    testName: string;
    gasPayer: {
        gasPayerServiceUrl: string;
        gasPayerPrivateKey?: undefined;
    };
    expected: {
        isDelegated: boolean;
        gasPayerOrUndefined: {
            gasPayerServiceUrl: string;
            gasPayerPrivateKey?: undefined;
        };
        gasPayerOrNull: {
            gasPayerServiceUrl: string;
            gasPayerPrivateKey?: undefined;
        };
    };
} | {
    testName: string;
    gasPayer: {
        gasPayerPrivateKey: string;
        gasPayerServiceUrl?: undefined;
    };
    expected: {
        isDelegated: boolean;
        gasPayerOrUndefined: {
            gasPayerPrivateKey: string;
            gasPayerServiceUrl?: undefined;
        };
        gasPayerOrNull: {
            gasPayerPrivateKey: string;
            gasPayerServiceUrl?: undefined;
        };
    };
} | {
    testName: string;
    expected: {
        isDelegated: boolean;
        gasPayerOrUndefined: undefined;
        gasPayerOrNull: null;
    };
    gasPayer?: undefined;
} | {
    testName: string;
    gasPayer: null;
    expected: {
        isDelegated: boolean;
        gasPayerOrUndefined: undefined;
        gasPayerOrNull: null;
    };
})[];
export { delegationHandlerFixture };
//# sourceMappingURL=fixture.d.ts.map