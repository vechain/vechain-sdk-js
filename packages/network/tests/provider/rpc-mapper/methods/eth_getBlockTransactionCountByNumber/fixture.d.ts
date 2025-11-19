import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
declare const validTestCases: {
    description: string;
    blockNumberHex: string;
    expectedTxCount: number;
}[];
/**
 * Invalid eth_getBlockTransactionCountByNumber RPC method test cases
 */
declare const invalidTestCases: {
    description: string;
    params: number[];
    expectedError: typeof JSONRPCInvalidParams;
}[];
export { invalidTestCases, validTestCases };
//# sourceMappingURL=fixture.d.ts.map