import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import {
    InvalidAbiEventError,
    InvalidAbiFormatTypeError,
    InvalidAbiFunctionError,
    InvalidAbiDataToDecodeError,
    InvalidAbiDataToEncodeError
} from '../src/model/abi';

describe('Abi errors', () => {
    test('buildInvalidAbiHighLevelDataToDecodeError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_DATA_TO_DECODE,
                'Invalid abi high level data to decode'
            )
        ).toBeInstanceOf(InvalidAbiDataToDecodeError);
    });
    test('buildInvalidAbiHighLevelDataToEncodeError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_DATA_TO_ENCODE,
                'Invalid abi high level data to encode'
            )
        ).toBeInstanceOf(InvalidAbiDataToEncodeError);
    });
    test('buildInvalidAbiEventError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_EVENT,
                'Invalid abi high level event'
            )
        ).toBeInstanceOf(InvalidAbiEventError);
    });
    test('buildInvalidAbiFormatTypeError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_FORMAT_TYPE,
                'Invalid abi high level format type'
            )
        ).toBeInstanceOf(InvalidAbiFormatTypeError);
    });
    test('buildInvalidAbiFunctionError', () => {
        expect(
            buildError(
                ERROR_CODES.ABI.INVALID_FUNCTION,
                'Invalid abi high level function'
            )
        ).toBeInstanceOf(InvalidAbiFunctionError);
    });
});
