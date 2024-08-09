import { describe, expect, test } from '@jest/globals';
import {
    InvalidHDNode,
    InvalidHDNodeMnemonic,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - HDNode
 * @group unit/errors/available-errors/hdnode
 */
describe('Error package Available errors test - HDNode', () => {
    /**
     * InvalidHDNodeMnemonic
     */
    test('InvalidHDNodeMnemonic', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            // Fragment type
            [{ wordlistSize: 0 }, undefined].forEach((data) => {
                expect(() => {
                    throw new InvalidHDNodeMnemonic(
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
     * InvalidHDNode
     */
    test('InvalidHDNode', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidHDNode(
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
