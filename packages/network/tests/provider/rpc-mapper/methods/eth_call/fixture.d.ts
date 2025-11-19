import { JSONRPCInternalError, JSONRPCTransactionRevertError } from '@vechain/sdk-errors';
/**
 * Fixtures for positive cases
 */
declare const positiveCasesFixtures: ({
    description: string;
    input: (string | {
        from: string;
        to: string;
        value: string;
        data: string;
    })[];
    expected: string;
} | {
    description: string;
    input: (string | {
        from: string;
        to: string;
        gas: number;
        gasPrice: string;
        value: string;
        data: string;
    })[];
    expected: string;
})[];
/**
 * Negative cases fixtures
 */
declare const negativeCasesFixtures: ({
    description: string;
    input: (string | {
        from: string;
    })[];
    expected: typeof JSONRPCInternalError;
} | {
    description: string;
    input: (string | {
        from: string;
        to: string;
        value: string;
        data: string;
    })[];
    expected: typeof JSONRPCTransactionRevertError;
})[];
export { negativeCasesFixtures, positiveCasesFixtures };
//# sourceMappingURL=fixture.d.ts.map