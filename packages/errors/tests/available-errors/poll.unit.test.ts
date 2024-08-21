import { describe, expect, test } from '@jest/globals';
import { PollExecution, VechainSDKError } from '../../src';

/**
 * Available errors test - Poll
 * @group unit/errors/available-errors/poll
 */
describe('Error package Available errors test - Poll', () => {
    /**
     * PollExecution
     */
    test('PollExecution', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new PollExecution(
                    'method',
                    'message',
                    { functionName: 'function' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
