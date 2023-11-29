import {
    buildError,
    DATA,
    InvalidDataTypeError
} from '@vechainfoundation/vechain-sdk-errors';

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
        throw buildError(DATA.INVALID_DATA_RETURN_TYPE, 'a cannot be 10');
    return await simpleIncrementFunction(a, a + 1);
};

/**
 * Simple invalid parameters fixture
 */
const invalidOptionsParametersForPollTests = [
    {
        requestIntervalInMilliseconds: -1,
        maximumIterations: 3,
        expectedError: InvalidDataTypeError
    },
    {
        requestIntervalInMilliseconds: 0,
        maximumIterations: 3,
        expectedError: InvalidDataTypeError
    },
    {
        requestIntervalInMilliseconds: 3,
        maximumIterations: 0,
        expectedError: InvalidDataTypeError
    },
    {
        requestIntervalInMilliseconds: 1,
        maximumIterations: -3,
        expectedError: InvalidDataTypeError
    },
    {
        requestIntervalInMilliseconds: 0.5,
        maximumIterations: 1,
        expectedError: InvalidDataTypeError
    },
    {
        requestIntervalInMilliseconds: 5,
        maximumIterations: 1.7,
        expectedError: InvalidDataTypeError
    }
];
export {
    simpleIncrementFunction,
    invalidOptionsParametersForPollTests,
    simpleThrowErrorFunctionIfInputIs10
};
