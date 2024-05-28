import { describe, expect, jest, test } from '@jest/globals';
import { VeChainSDKLogger } from '../src';

/**
 * Log logger tests
 *
 * @group unit/logging/log-logger
 */
describe('Log logger tests', () => {
    /**
     * Should be able to log a generic log
     */
    test('Should be able to log a log', () => {
        const logSpy = jest.spyOn(VeChainSDKLogger('log'), 'log');

        VeChainSDKLogger('log').log({
            title: 'Title of the log message ...',
            messages: ['Message to log 1...', 'Message to log 2...']
        });

        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
