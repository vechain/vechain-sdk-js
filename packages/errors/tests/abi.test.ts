import { describe, expect, test } from '@jest/globals';
import { buildError, ERROR_CODES } from '../src';
import {
    InvalidAbiEventError,
    InvalidAbiFormatTypeError,
    InvalidAbiFunctionError,
    InvalidAbiDataToDecodeError,
    InvalidAbiDataToEncodeError
} from '../src/model/abi';

/**
 * ABI errors
 */
describe('Abi errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidAbiDataToDecodeError
     */
    test('Check that the constructed error is an instance of InvalidAbiDataToDecodeError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_DATA_TO_DECODE,
                'Invalid abi data to decode'
            )
        ).toBeInstanceOf(InvalidAbiDataToDecodeError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidAbiDataToDecodeError
     */
    test('Check that the constructed error is an instance of InvalidAbiDataToEncodeError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_DATA_TO_ENCODE,
                'Invalid abi data to encode'
            )
        ).toBeInstanceOf(InvalidAbiDataToEncodeError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidAbiDataToDecodeError
     */
    test('Check that the constructed error is an instance of InvalidAbiEventError', () => {
        expect(
            buildError(ERROR_CODES.ABI.INVALID_EVENT, 'Invalid abi event')
        ).toBeInstanceOf(InvalidAbiEventError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidAbiDataToDecodeError
     */
    test('Check that the constructed error is an instance of InvalidAbiFormatTypeError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_FORMAT_TYPE,
                'Invalid abi format type'
            )
        ).toBeInstanceOf(InvalidAbiFormatTypeError);
    });
    /**
     * Verify that the error is an instance of the expected error InvalidAbiDataToDecodeError
     */
    test('Check that the constructed error is an instance of InvalidAbiFunctionError', () => {
        expect(
            buildError(ERROR_CODES.ABI.INVALID_FUNCTION, 'Invalid abi function')
        ).toBeInstanceOf(InvalidAbiFunctionError);
    });
});
