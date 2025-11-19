import { type TransactionBody } from '@vechain/sdk-core';
/**
 * Some random transaction nonces to use into tests
 */
declare const transactionNonces: {
    waitForTransactionTestCases: number[];
    sendTransactionWithANumberAsValueInTransactionBody: number[];
    invalidWaitForTransactionTestCases: number[];
    shouldThrowErrorIfTransactionIsntSigned: number[];
};
/**
 * Clause to transfer 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
declare const transfer1VTHOClause: {
    to: string;
    value: string;
    data: string;
};
/**
 * transaction body that transfers 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
declare const transferTransactionBody: Omit<TransactionBody, 'gas' | 'nonce' | 'chainTag' | 'blockRef'>;
/**
 * transaction body that transfers 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
declare const transferTransactionBodyValueAsNumber: Omit<TransactionBody, 'gas' | 'nonce' | 'chainTag' | 'blockRef'>;
/**
 * Expected transaction receipt values.
 * Note that this object is not a valid `TransactionReceipt` object.
 */
declare const expectedReceipt: {
    events: never[];
    gasPayer: string;
    gasUsed: number;
    outputs: {
        contractAddress: null;
        events: {
            address: string;
            data: string;
            topics: string[];
        }[];
        transfers: never[];
    }[];
    reverted: boolean;
};
/**
 * waitForTransaction test cases that should return a transaction receipt
 */
declare const waitForTransactionTestCases: ({
    description: string;
    options: {
        timeoutMs: undefined;
        intervalMs: undefined;
        nonce: number;
    };
} | {
    description: string;
    options: {
        timeoutMs: number;
        intervalMs: undefined;
        nonce: number;
    };
} | {
    description: string;
    options: {
        timeoutMs: undefined;
        intervalMs: number;
        nonce: number;
    };
} | {
    description: string;
    options: {
        timeoutMs: number;
        intervalMs: number;
        nonce: number;
    };
})[];
/**
 * waitForTransaction test cases that should not return a transaction receipt. Instead, should return null.
 */
declare const invalidWaitForTransactionTestCases: {
    description: string;
    options: {
        timeoutMs: number;
        intervalMs: undefined;
        nonce: number;
        dependsOn: string;
    };
}[];
/**
 * buildTransactionBody test cases
 */
declare const buildTransactionBodyClausesTestCases: ({
    description: string;
    clauses: {
        to: string;
        value: string;
        data: string;
    }[];
    options: {
        gasPriceCoef: number;
        expiration?: undefined;
        isDelegated?: undefined;
        dependsOn?: undefined;
    };
    expected: {
        solo: {
            chainTag: Promise<number>;
            clauses: {
                data: string;
                to: string;
                value: string;
            }[];
            dependsOn: null;
            expiration: number;
            gas: number;
            gasPriceCoef: number;
            reserved: undefined;
        };
        testnet: {
            chainTag: number;
            clauses: {
                data: string;
                to: string;
                value: string;
            }[];
            dependsOn: null;
            expiration: number;
            gas: number;
            gasPriceCoef: number;
            reserved: undefined;
        };
    };
} | {
    description: string;
    clauses: {
        to: string;
        value: string;
        data: string;
    }[];
    options: {
        gasPriceCoef: number;
        expiration: number;
        isDelegated: boolean;
        dependsOn: string;
    };
    expected: {
        solo: {
            chainTag: Promise<number>;
            clauses: {
                data: string;
                to: string;
                value: string;
            }[];
            dependsOn: string;
            expiration: number;
            gas: number;
            gasPriceCoef: number;
            reserved: {
                features: number;
            };
        };
        testnet: {
            chainTag: number;
            clauses: {
                data: string;
                to: string;
                value: string;
            }[];
            dependsOn: string;
            expiration: number;
            gas: number;
            gasPriceCoef: number;
            reserved: {
                features: number;
            };
        };
    };
} | {
    description: string;
    clauses: ({
        to: string;
        value: string;
        data: string;
    } | {
        to: null;
        value: string;
        data: string;
    })[];
    options: {
        gasPriceCoef: number;
        expiration: number;
        isDelegated: boolean;
        dependsOn: string;
    };
    expected: {
        testnet: {
            chainTag: number;
            clauses: ({
                data: string;
                to: string;
                value: string;
            } | {
                to: null;
                data: string;
                value: string;
            })[];
            dependsOn: string;
            expiration: number;
            gas: number;
            gasPriceCoef: number;
            reserved: {
                features: number;
            };
        };
        solo?: undefined;
    };
})[];
/**
 * Fixture for getRevertReason method
 */
declare const getRevertReasonTestCasesFixture: ({
    description: string;
    revertedTransactionHash: string;
    expected: string;
    errorFragment?: undefined;
} | {
    description: string;
    revertedTransactionHash: string;
    expected: null;
    errorFragment?: undefined;
} | {
    description: string;
    revertedTransactionHash: string;
    expected: string;
    errorFragment: string;
})[];
export { buildTransactionBodyClausesTestCases, expectedReceipt, getRevertReasonTestCasesFixture, invalidWaitForTransactionTestCases, transactionNonces, transfer1VTHOClause, transferTransactionBody, transferTransactionBodyValueAsNumber, waitForTransactionTestCases };
//# sourceMappingURL=fixture.d.ts.map