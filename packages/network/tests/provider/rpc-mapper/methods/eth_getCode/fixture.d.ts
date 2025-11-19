import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Test cases for eth_getCode RPC method
 */
declare const ethGetCodeTestCases: {
    description: string;
    params: string[];
    expected: string;
}[];
/**
 * Test cases for eth_getCode RPC method that throw an error
 */
declare const invalidEthGetCodeTestCases: {
    description: string;
    params: string[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { ethGetCodeTestCases, invalidEthGetCodeTestCases };
//# sourceMappingURL=fixture.d.ts.map