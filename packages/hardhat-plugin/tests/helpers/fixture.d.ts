import { JSONRPCInternalError } from '@vechain/sdk-errors';
/**
 * Positive test cases for createWalletFromHardhatNetworkConfig function
 */
declare const createWalletFromHardhatNetworkConfigPositiveCasesFixture: ({
    test: string;
    networkConfig: {
        url: string;
        chainId: number;
        accounts?: undefined;
        gasPayer?: undefined;
    };
    expectedAddresses: never[];
} | {
    test: string;
    networkConfig: {
        url: string;
        chainId: number;
        accounts: string[];
        gasPayer?: undefined;
    };
    expectedAddresses: string[];
} | {
    test: string;
    networkConfig: {
        url: string;
        chainId: number;
        accounts: string[];
        gasPayer: {
            gasPayerPrivateKey: string;
            gasPayerServiceUrl: string;
        };
    };
    expectedAddresses: string[];
} | {
    test: string;
    networkConfig: {
        url: string;
        chainId: number;
        accounts: {
            mnemonic: string;
            path: string;
            count: number;
            initialIndex: number;
        };
        gasPayer?: undefined;
    };
    expectedAddresses: string[];
} | {
    test: string;
    networkConfig: {
        url: string;
        chainId: number;
        accounts: {
            mnemonic: string;
            path: string;
            count: number;
            initialIndex: number;
        };
        gasPayer: {
            gasPayerPrivateKey: string;
            gasPayerServiceUrl: string;
        };
    };
    expectedAddresses: string[];
})[];
/**
 * Negative test cases for createWalletFromHardhatNetworkConfig function
 */
declare const createWalletFromHardhatNetworkConfigNegativeCasesFixture: {
    test: string;
    networkConfig: {
        url: string;
        chainId: number;
        accounts: string;
    };
    expectedError: typeof JSONRPCInternalError;
}[];
export { createWalletFromHardhatNetworkConfigNegativeCasesFixture, createWalletFromHardhatNetworkConfigPositiveCasesFixture };
//# sourceMappingURL=fixture.d.ts.map