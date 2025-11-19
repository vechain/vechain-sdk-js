import { type TransactionClause } from '@vechain/sdk-core';
import { InvalidDataType } from '@vechain/sdk-errors';
declare const EIP191_PRIVATE_KEY = "0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf3";
declare const EIP191_MESSAGE = "Hello world! - \u3053\u3093\u306B\u3061\u306F\u4E16\u754C - \uD83D\uDC4B\uD83D\uDDFA\uFE0F!";
declare const eip712TestCases: {
    invalid: {
        name: string;
        domain: {
            name: string;
            version: string;
            chainId: number;
            verifyingContract: string;
        };
        primaryType: string;
        types: {
            Mail: {
                name: string;
                type: string;
            }[];
        };
        data: {
            from: {
                name: string;
                wallet: string;
            };
            to: {
                name: string;
                wallet: string;
            };
            contents: string;
        };
        encoded: string;
        digest: string;
        privateKey: string;
        signature: string;
    };
    valid: {
        name: string;
        domain: {
            name: string;
            version: string;
            chainId: number;
            verifyingContract: string;
        };
        primaryType: string;
        types: {
            Person: {
                name: string;
                type: string;
            }[];
            Mail: {
                name: string;
                type: string;
            }[];
        };
        data: {
            from: {
                name: string;
                wallet: string;
            };
            to: {
                name: string;
                wallet: string;
            };
            contents: string;
        };
        encoded: string;
        digest: string;
        privateKey: string;
        signature: string;
    };
};
/**
 * Account to populate call test cases
 */
declare const populateCallTestCasesAccount: {
    privateKey: string;
    address: string;
};
/**
 * Test cases for populateCall function
 */
declare const populateCallTestCases: {
    /**
     * Positive test cases
     */
    positive: ({
        description: string;
        transactionToPopulate: {
            clauses: never[];
            from?: undefined;
            to?: undefined;
        };
        expected: {
            clauses: never[];
            from: string;
            to: null;
            data?: undefined;
            value?: undefined;
        };
    } | {
        description: string;
        transactionToPopulate: {
            clauses: TransactionClause[];
            from?: undefined;
            to?: undefined;
        };
        expected: {
            clauses: TransactionClause[];
            data: string;
            from: string;
            to: string;
            value: number;
        };
    } | {
        description: string;
        transactionToPopulate: {
            clauses?: undefined;
            from?: undefined;
            to?: undefined;
        };
        expected: {
            from: string;
            to: null;
            clauses?: undefined;
            data?: undefined;
            value?: undefined;
        };
    } | {
        description: string;
        transactionToPopulate: {
            from: string;
            clauses?: undefined;
            to?: undefined;
        };
        expected: {
            from: string;
            to: null;
            clauses?: undefined;
            data?: undefined;
            value?: undefined;
        };
    } | {
        description: string;
        transactionToPopulate: {
            to: string;
            clauses?: undefined;
            from?: undefined;
        };
        expected: {
            from: string;
            to: string;
            clauses?: undefined;
            data?: undefined;
            value?: undefined;
        };
    })[];
    /**
     * Negative test cases
     */
    negative: {
        description: string;
        transactionToPopulate: {
            from: string;
        };
        expectedError: typeof InvalidDataType;
    }[];
};
export { EIP191_MESSAGE, EIP191_PRIVATE_KEY, eip712TestCases, populateCallTestCases, populateCallTestCasesAccount };
//# sourceMappingURL=fixture-unit.d.ts.map