import { describe, expect, test } from '@jest/globals';
import {
    InvalidKeystore,
    InvalidKeystoreParams,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - Keystore
 * @group unit/errors/available-errors/keystore
 */
describe('Error package Available errors test - Keystore', () => {
    /**
     * InvalidKeystore
     */
    test('InvalidKeystore', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidKeystore(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidKeystoreParams
     */
    test('InvalidKeystoreParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidKeystoreParams(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
