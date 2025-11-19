import { InvalidDataType } from '@vechain/sdk-errors';
import type { ExpandedBlockDetail } from '../../../src';
/**
 * waitForBlock test cases
 */
declare const waitForBlockTestCases: ({
    options: {
        timeoutMs: undefined;
        intervalMs: undefined;
    };
} | {
    options: {
        timeoutMs: number;
        intervalMs: undefined;
    };
} | {
    options: {
        timeoutMs: undefined;
        intervalMs: number;
    };
} | {
    options: {
        timeoutMs: number;
        intervalMs: number;
    };
})[];
declare const validCompressedBlockRevisions: ({
    revision: string;
    expected: {
        number: number;
        id: string;
        size: number;
        parentID: string;
        timestamp: number;
        gasLimit: number;
        beneficiary: string;
        gasUsed: number;
        totalScore: number;
        txsRoot: string;
        txsFeatures: number;
        stateRoot: string;
        receiptsRoot: string;
        com: boolean;
        signer: string;
        isTrunk: boolean;
        isFinalized: boolean;
        transactions: never[];
    };
} | {
    revision: number;
    expected: {
        number: number;
        id: string;
        size: number;
        parentID: string;
        timestamp: number;
        gasLimit: number;
        beneficiary: string;
        gasUsed: number;
        totalScore: number;
        txsRoot: string;
        txsFeatures: number;
        stateRoot: string;
        receiptsRoot: string;
        com: boolean;
        signer: string;
        isTrunk: boolean;
        isFinalized: boolean;
        transactions: never[];
    };
})[];
declare const validExpandedBlockRevisions: {
    revision: string;
    expected: {
        number: number;
        id: string;
        size: number;
        parentID: string;
        timestamp: number;
        gasLimit: number;
        beneficiary: string;
        gasUsed: number;
        totalScore: number;
        txsRoot: string;
        txsFeatures: number;
        stateRoot: string;
        receiptsRoot: string;
        com: boolean;
        signer: string;
        isTrunk: boolean;
        isFinalized: boolean;
        transactions: {
            id: string;
            chainTag: number;
            type: number;
            blockRef: string;
            expiration: number;
            clauses: {
                to: string;
                value: string;
                data: string;
            }[];
            gasPriceCoef: number;
            gas: number;
            origin: string;
            delegator: null;
            nonce: string;
            dependsOn: null;
            size: number;
            gasUsed: number;
            gasPayer: string;
            paid: string;
            reward: string;
            reverted: boolean;
            outputs: {
                contractAddress: null;
                events: never[];
                transfers: {
                    sender: string;
                    recipient: string;
                    amount: string;
                }[];
            }[];
        }[];
    };
}[];
declare const invalidBlockRevisions: {
    description: string;
    revision: string;
    expectedError: typeof InvalidDataType;
}[];
declare const expandedBlockDetailFixture: ExpandedBlockDetail;
export { waitForBlockTestCases, validCompressedBlockRevisions, validExpandedBlockRevisions, invalidBlockRevisions, expandedBlockDetailFixture };
//# sourceMappingURL=fixture.d.ts.map