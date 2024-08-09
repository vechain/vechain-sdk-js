import { describe, expect, test } from '@jest/globals';
import {
    InvalidSecp256k1MessageHash,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - Secp2561k1
 * @group unit/errors/available-errors/secp2561k1
 */
describe('Error package Available errors test - Secp2561k1', () => {
    /**
     * InvalidSecp256k1PrivateKey
     */
    test('InvalidSecp256k1PrivateKey', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidSecp256k1PrivateKey(
                    'method',
                    'message',
                    undefined,
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidSecp256k1MessageHash
     */
    test('InvalidSecp256k1MessageHash', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidSecp256k1MessageHash(
                    'method',
                    'message',
                    { messageHash: new Uint8Array(0) },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidSecp256k1Signature
     */
    test('InvalidSecp256k1Signature', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidSecp256k1Signature(
                    'method',
                    'message',
                    {
                        signature: new Uint8Array(0),
                        recovery: 0
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
