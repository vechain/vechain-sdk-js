import { describe, expect, test } from '@jest/globals';
import { InvalidBloom, InvalidBloomParams, VechainSDKError } from '../../src';

/**
 * Available errors test - Bloom
 * @group unit/errors/available-errors/bloom
 */
describe('Error package Available errors test - Bloom', () => {
    /**
     * InvalidBloom
     */
    test('InvalidBloom', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidBloom(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidBloom
     */
    test('InvalidBloomParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidBloomParams(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
