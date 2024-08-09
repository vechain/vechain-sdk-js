import { describe, expect, test } from '@jest/globals';
import { InvalidCastType, VechainSDKError } from '../../src';

/**
 * Available errors test - VCDM
 * @group unit/errors/available-errors/vcdm
 */
describe('Error package Available errors test - VCDM', () => {
    /**
     * InvalidCastType
     */
    test('InvalidCastType', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidCastType<{ data: string }>(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
