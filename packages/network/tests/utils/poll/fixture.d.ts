import { InvalidDataType } from '@vechain/sdk-errors';
/**
 * Simple increment function fixture
 */
declare const simpleIncrementFunction: (initialValue: number, max: number) => Promise<number>;
/**
 * Simple throw error function fixture
 * It throws an error if the input is 10
 */
declare const simpleThrowErrorFunctionIfInputIs10: (a: number) => Promise<number>;
/**
 * Simple invalid parameters fixture
 */
declare const invalidOptionsParametersForPollTests: ({
    requestIntervalInMilliseconds: number;
    maximumIterations: number;
    expectedError: typeof InvalidDataType;
    maximumWaitingTimeInMilliseconds?: undefined;
} | {
    requestIntervalInMilliseconds: number;
    maximumIterations: number;
    maximumWaitingTimeInMilliseconds: number;
    expectedError: typeof InvalidDataType;
})[];
export { simpleIncrementFunction, invalidOptionsParametersForPollTests, simpleThrowErrorFunctionIfInputIs10 };
//# sourceMappingURL=fixture.d.ts.map