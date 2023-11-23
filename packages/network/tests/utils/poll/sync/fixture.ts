import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Simple increment function fixture
 */
const simpleIncrementFunction = (initialValue: number, max: number): number => {
    if (initialValue < max)
        return simpleIncrementFunction(initialValue + 1, max);
    return initialValue;
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
export { simpleIncrementFunction, invalidOptionsParameters };
