import { describe, expect, test } from '@jest/globals';
import { InvalidAddress, VechainSDKError } from '../../src';

/**
 * Available errors test - Address
 * @group unit/errors/available-errors/address
 */
describe('Error package Available errors test - Address', () => {
    /**
     * InvalidAddress
     */
    test('InvalidAddress', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidAddress(
                    'method',
                    'message',
                    { address: 'address' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
