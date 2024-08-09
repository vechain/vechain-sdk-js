import { describe, expect, test } from '@jest/globals';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
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
     * InvalidAbiFragment
     */
    test('InvalidAbiFragment', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            // Fragment type
            [
                {
                    type: 'function' as 'function' | 'event',
                    fragment: 'fragment' as unknown
                },
                {
                    type: 'event' as 'function' | 'event',
                    fragment: 'fragment' as unknown
                }
            ].forEach((data) => {
                expect(() => {
                    throw new InvalidAbiFragment(
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
