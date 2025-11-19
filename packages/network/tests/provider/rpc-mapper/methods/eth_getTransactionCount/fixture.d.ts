import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Negative test cases for eth_getTransactionCount
 */
declare const invalidEthGetTransactionCountTestCases: {
    description: string;
    params: string[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { invalidEthGetTransactionCountTestCases };
//# sourceMappingURL=fixture.d.ts.map