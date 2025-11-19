import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * eth_getBalance RPC call tests - Positive cases
 */
declare const ethGetBalanceTestCases: {
    description: string;
    params: string[];
    expected: string;
}[];
/**
 * eth_getBalance RPC call tests - Negative cases
 */
declare const invalidEthGetBalanceTestCases: {
    description: string;
    params: string[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { ethGetBalanceTestCases, invalidEthGetBalanceTestCases };
//# sourceMappingURL=fixture.d.ts.map