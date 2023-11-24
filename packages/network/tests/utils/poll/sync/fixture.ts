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
const invalidOptionsParameters = [
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
    }
];
export {
    simpleIncrementFunction,
    invalidOptionsParameters,
    simpleThrowErrorFunctionIfInputIs10
};
