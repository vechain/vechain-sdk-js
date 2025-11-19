import { InvalidDataType } from '@vechain/sdk-errors';
/**
 * Test cases for `estimateGas` method
 */
declare const estimateGasTestCases: {
    revert: ({
        description: string;
        clauses: {
            to: string;
            value: string;
            data: string;
        }[];
        caller: string;
        options: {
            gas?: undefined;
        };
        expected: {
            revertReasons: string[];
            reverted: boolean;
            totalGas: number;
            vmErrors: string[];
        };
    } | {
        description: string;
        clauses: {
            to: string;
            value: string;
            data: string;
        }[];
        caller: string;
        options: {
            gas: number;
        };
        expected: {
            reverted: boolean;
            totalGas: number;
            revertReasons: string[];
            vmErrors: string[];
        };
    })[];
    success: ({
        description: string;
        clauses: {
            to: string;
            value: string;
            data: string;
        }[];
        caller: string;
        options: {
            gasPayer?: undefined;
            gasPadding?: undefined;
        };
        expected: {
            reverted: boolean;
            totalGas: number;
            revertReasons: never[];
            vmErrors: never[];
        };
    } | {
        description: string;
        clauses: {
            to: string;
            value: string;
            data: string;
        }[];
        caller: string;
        options: {
            gasPayer: string;
            gasPadding?: undefined;
        };
        expected: {
            reverted: boolean;
            totalGas: number;
            revertReasons: never[];
            vmErrors: never[];
        };
    } | {
        description: string;
        clauses: {
            to: string;
            value: string;
            data: string;
        }[];
        caller: string;
        options: {
            gasPadding: number;
            gasPayer?: undefined;
        };
        expected: {
            reverted: boolean;
            totalGas: number;
            revertReasons: never[];
            vmErrors: never[];
        };
    })[];
};
/**
 * Test cases where the estimation throws an error
 */
declare const invalidEstimateGasTestCases: ({
    clauses: never[];
    options: {
        gasPadding?: undefined;
    };
    expectedError: typeof InvalidDataType;
} | {
    clauses: {
        to: string;
        value: string;
        data: string;
    }[];
    options: {
        gasPadding: number;
    };
    expectedError: typeof InvalidDataType;
})[];
export { estimateGasTestCases, invalidEstimateGasTestCases };
//# sourceMappingURL=fixture.d.ts.map