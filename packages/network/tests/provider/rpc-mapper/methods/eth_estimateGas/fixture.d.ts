import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
/**
 * Fixtures for positive cases
 */
declare const positiveCasesFixtures: ({
    description: string;
    input: (string | {
        from: string;
        to: string;
        value: string;
    })[];
    expected: string;
} | {
    description: string;
    input: (string | {
        value: string;
        from: string;
        data: string;
    })[];
    expected: string;
} | {
    description: string;
    input: (string | {
        to: string;
        value: string;
    })[];
    expected: string;
})[];
/**
 * Negative cases fixtures
 */
declare const negativeCasesFixtures: {
    description: string;
    input: never[];
    expected: typeof JSONRPCInvalidParams;
}[];
export { negativeCasesFixtures, positiveCasesFixtures };
//# sourceMappingURL=fixture.d.ts.map