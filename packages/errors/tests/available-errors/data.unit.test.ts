import { describe, expect, test } from '@jest/globals';
import {
    InvalidDataType,
    UnsupportedOperation,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - Data
 * @group unit/errors/available-errors/data
 */
describe('Error package Available errors test - Data', () => {
    /**
     * InvalidDataType
     */
    test('InvalidDataType', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidDataType(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * UnsupportedOperation
     */
    test('UnsupportedOperation', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new UnsupportedOperation(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
