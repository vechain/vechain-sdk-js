import { describe, expect, jest, test } from '@jest/globals';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import { VeChainSDKLogger } from '../src';

/**
 * Error logger tests
 *
 * @group unit/logging/error-logger
 */
describe('Error logger tests', () => {
    /**
     * Should be able to log an error
     */
    test('Should be able to log an error', () => {
        const logSpy = jest.spyOn(VeChainSDKLogger('error'), 'log');

        VeChainSDKLogger('error').log(
            new JSONRPCInternalError('test-method', `Error on request`, {
                some: 'data'
            })
        );

        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
