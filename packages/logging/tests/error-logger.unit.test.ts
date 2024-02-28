import { describe, expect, jest, test } from '@jest/globals';
import { DATA } from '@vechain/vechain-sdk-errors';
import { VechainSDKLogger } from '../src';

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
        const logSpy = jest.spyOn(VechainSDKLogger('error'), 'log');

        VechainSDKLogger('error').log({
            errorCode: DATA.INVALID_DATA_TYPE,
            errorMessage: 'Message we want to use for invalid data type ...',
            errorData: {
                data: 'This is the data that caused the error'
            },
            innerError: new Error('This is the inner error')
        });

        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
