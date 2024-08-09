import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Simple increment function fixture
 */
const simpleIncrementFunction = async (
    initialValue: number,
    max: number
): Promise<number> => {
    if (initialValue < max)
        return await simpleIncrementFunction(initialValue + 1, max);
    return initialValue;
};

/**
 * Simple throw error function fixture
 * It throws an error if the input is 10
 */
const simpleThrowErrorFunctionIfInputIs10 = async (
    a: number
): Promise<number> => {
    if (a === 10)
        throw new InvalidDataType(
            'simpleThrowErrorFunctionIfInputIs10()',
            "Input value error: 'a' must not be 10.",
            { input: a }
        );

    return await simpleIncrementFunction(a, a + 1);
};

/**
 * Simple invalid parameters fixture
 */
const invalidOptionsParametersForPollTests = [
    {
        requestIntervalInMilliseconds: -1,
        maximumIterations: 3,
        expectedError: InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 0,
        maximumIterations: 3,
        expectedError: InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 3,
        maximumIterations: 0,
        expectedError: InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 1,
        maximumIterations: -3,
        expectedError: InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 0.5,
        maximumIterations: 1,
        expectedError: InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 5,
        maximumIterations: 1.7,
        expectedError: InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 1,
        maximumIterations: 1,
        maximumWaitingTimeInMilliseconds: -1,
        expectedError: InvalidDataType
    }
];
export {
    simpleIncrementFunction,
    invalidOptionsParametersForPollTests,
    simpleThrowErrorFunctionIfInputIs10
};
