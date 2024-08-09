import { describe, expect, test } from '@jest/globals';
import { FunctionNotImplemented, VechainSDKError } from '../../src';

/**
 * Available errors test - Function
 * @group unit/errors/available-errors/function
 */
describe('Error package Available errors test - Function', () => {
    /**
     * FunctionNotImplemented
     */
    test('FunctionNotImplemented', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new FunctionNotImplemented(
                    'method',
                    'message',
                    { functionName: 'function', data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
