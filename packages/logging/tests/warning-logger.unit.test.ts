import { describe, expect, jest, test } from '@jest/globals';
import { VeChainSDKLogger } from '../src';

/**
 * Warning logger tests
 *
 * @group unit/logging/warning-logger
 */
describe('Warning logger tests', () => {
    /**
     * Should be able to log a generic log
     */
    test('Should be able to log a warning', () => {
        const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

        VeChainSDKLogger('warning').log({
            title: 'Title of the warning message ...',
            messages: [
                'Warning message to log 1...',
                'Warning message to log 2...'
            ]
        });

        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
