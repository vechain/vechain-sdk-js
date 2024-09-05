import { describe, expect, test } from '@jest/globals';
import { InvalidHDKey, InvalidHDKeyMnemonic, VechainSDKError } from '../../src';

/**
 * Available errors test - HDKey
 * @group unit/errors/available-errors/hdkey
 */
describe('Error package Available errors test - HDKey', () => {
    /**
     * InvalidHDKeyMnemonic
     */
    test('InvalidHDKeyMnemonic', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            // Fragment type
            [{ wordlistSize: 0 }, undefined].forEach((data) => {
                expect(() => {
                    throw new InvalidHDKeyMnemonic(
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
     * InvalidHDKey
     */
    test('InvalidHDKey', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidHDKey(
                    'method',
                    'message',
                    {
                        derivationPath: 'path',
                        chainCode: new Uint8Array(0),
                        publicKey: new Uint8Array(0)
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
