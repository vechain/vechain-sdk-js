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
     * InvalidAbiDataToEncodeOrDecode
     */
    test('InvalidAbiDataToEncodeOrDecode', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidAbiDataToEncodeOrDecode(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidAbiItem
     */
    test('InvalidAbiItem', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            // ABI item type
            [
                {
                    type: 'function' as 'function' | 'event',
                    value: 'abiItem' as unknown
                },
                {
                    type: 'event' as 'function' | 'event',
                    value: 'abiItem' as unknown
                }
            ].forEach((data) => {
                expect(() => {
                    throw new InvalidAbiItem(
                        'method',
                        'message',
                        data,
                        innerError
                    );
                }).toThrowError(VechainSDKError);
            });
        });
    });

    /**
     * InvalidAbiSignatureFormat
     */
    test('InvalidAbiSignatureFormat', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidAbiSignatureFormat(
                    'method',
                    'message',
                    { signatureFormat: 'signatureFormat' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
