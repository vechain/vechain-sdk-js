import { describe, expect, test } from '@jest/globals';
import { InvalidRLP, VechainSDKError } from '../../src';

/**
 * Available errors test - RLP
 * @group unit/errors/available-errors/rlp
 */
describe('Error package Available errors test - RLP', () => {
    /**
     * InvalidRLP
     */
    test('InvalidRLP', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidRLP(
                    'method',
                    'message',
                    {
                        context: 'context',
                        data: {
                            data: 'data'
                        }
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
