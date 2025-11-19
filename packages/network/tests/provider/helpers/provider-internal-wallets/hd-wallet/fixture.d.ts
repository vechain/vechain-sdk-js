/**
 * HDNode fixtures
 */
declare const hdNodeFixtures: ({
    mnemonic: string;
    path: string;
    count: number;
    initialIndex: number;
    gasPayer: {
        gasPayerPrivateKey: string;
        gasPayerServiceUrl?: undefined;
    };
    expectedAddress: string[];
} | {
    mnemonic: string;
    count: number;
    initialIndex: number;
    gasPayer: {
        gasPayerServiceUrl: string;
        gasPayerPrivateKey?: undefined;
    };
    expectedAddress: string[];
    path?: undefined;
} | {
    mnemonic: string;
    expectedAddress: string[];
    path?: undefined;
    count?: undefined;
    initialIndex?: undefined;
    gasPayer?: undefined;
})[];
export { hdNodeFixtures };
//# sourceMappingURL=fixture.d.ts.map