import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Test cases for eth_getStorageAt RPC method
 */
declare const ethGetStorageAtTestCases: Array<{
    expected: string;
    description: string;
    params: string[];
}>;
/**
 * Test cases for eth_getStorageAt RPC method that throw an error
 */
declare const invalidEthGetStorageAtTestCases: {
    description: string;
    params: string[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { ethGetStorageAtTestCases, invalidEthGetStorageAtTestCases };
//# sourceMappingURL=fixture.d.ts.map