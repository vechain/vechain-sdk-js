"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleThrowErrorFunctionIfInputIs10 = exports.invalidOptionsParametersForPollTests = exports.simpleIncrementFunction = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Simple increment function fixture
 */
const simpleIncrementFunction = async (initialValue, max) => {
    if (initialValue < max)
        return await simpleIncrementFunction(initialValue + 1, max);
    return initialValue;
};
exports.simpleIncrementFunction = simpleIncrementFunction;
/**
 * Simple throw error function fixture
 * It throws an error if the input is 10
 */
const simpleThrowErrorFunctionIfInputIs10 = async (a) => {
    if (a === 10)
        throw new sdk_errors_1.InvalidDataType('simpleThrowErrorFunctionIfInputIs10()', "Input value error: 'a' must not be 10.", { input: a });
    return await simpleIncrementFunction(a, a + 1);
};
exports.simpleThrowErrorFunctionIfInputIs10 = simpleThrowErrorFunctionIfInputIs10;
/**
 * Simple invalid parameters fixture
 */
const invalidOptionsParametersForPollTests = [
    {
        requestIntervalInMilliseconds: -1,
        maximumIterations: 3,
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 0,
        maximumIterations: 3,
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 3,
        maximumIterations: 0,
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 1,
        maximumIterations: -3,
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 0.5,
        maximumIterations: 1,
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 5,
        maximumIterations: 1.7,
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        requestIntervalInMilliseconds: 1,
        maximumIterations: 1,
        maximumWaitingTimeInMilliseconds: -1,
        expectedError: sdk_errors_1.InvalidDataType
    }
];
exports.invalidOptionsParametersForPollTests = invalidOptionsParametersForPollTests;
