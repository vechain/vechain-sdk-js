import { describe, expect, test } from '@jest/globals';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem,
    InvalidAbiSignatureFormat,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - ABI
 * @group unit/errors/available-errors/abi
 */
describe('Error package Available errors test - ABI', () => {
    /**
     * Helper function to test InvalidAbiDataToEncodeOrDecode
     */
    const testInvalidAbiDataToEncodeOrDecode = (innerError?: Error): void => {
        expect(() => {
            throw new InvalidAbiDataToEncodeOrDecode(
                'method',
                'message',
                { data: 'data' },
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test InvalidAbiDataToEncodeOrDecode
     */
    test('InvalidAbiDataToEncodeOrDecode', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testInvalidAbiDataToEncodeOrDecode(innerError);
        });
    });

    /**
     * Helper function to test InvalidAbiItem
     */
    const testInvalidAbiItem = (
        data: { type: 'function' | 'event'; value: unknown },
        innerError?: Error
    ): void => {
        expect(() => {
            throw new InvalidAbiItem('method', 'message', data, innerError);
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test InvalidAbiItem
     */
    test('InvalidAbiItem', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            const abiItems = [
                { type: 'function' as const, value: 'abiItem' }, // Correctly typed
                { type: 'event' as const, value: 'abiItem' } // Correctly typed
            ];

            abiItems.forEach((data) => {
                testInvalidAbiItem(data, innerError);
            });
        });
    });

    /**
     * Helper function to test InvalidAbiSignatureFormat
     */
    const testInvalidAbiSignatureFormat = (innerError?: Error): void => {
        expect(() => {
            throw new InvalidAbiSignatureFormat(
                'method',
                'message',
                { signatureFormat: 'signatureFormat' },
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test InvalidAbiSignatureFormat
     */
    test('InvalidAbiSignatureFormat', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testInvalidAbiSignatureFormat(innerError);
        });
    });
});
