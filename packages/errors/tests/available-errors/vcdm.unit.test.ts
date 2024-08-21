import { describe, expect, test } from '@jest/globals';
import { InvalidOperation, VechainSDKError } from '../../src';

/**
 * Available errors test - VCDM
 * @group unit/errors/available-errors/vcdm
 */
describe('Error package Available errors test - VCDM', () => {
    /**
     * InvalidOperation
     */
    test('InvalidOperation', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidOperation(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
