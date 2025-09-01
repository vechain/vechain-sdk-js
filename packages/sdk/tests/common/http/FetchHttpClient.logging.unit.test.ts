import { FetchHttpClient } from '@common/http';
import { JSONLogger, LoggerRegistry } from '@common/logging';
import { describe, expect, jest, test } from '@jest/globals';

/**
 * @group unit
 */
describe('FetchHttpClient logging', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        LoggerRegistry.getInstance().clearRegisteredLogger();
    });
    test('info log is emitted for successful response', async () => {
        const jsonLogger = new JSONLogger();
        LoggerRegistry.getInstance().registerLogger(jsonLogger);
        const loggerSpy = jest.spyOn(jsonLogger, 'log');
        const httpClient = new FetchHttpClient(
            new URL('https://mainnet.vechain.org')
        );
        const response = await httpClient.get();
        expect(response.status).toBe(200);
        const callArgs = loggerSpy.mock.calls[0][0];
        expect(callArgs).toMatchObject({
            verbosity: 'info',
            message: 'HTTP Response',
            source: 'FetchHttpClient'
        });
        expect(callArgs.context).toBeDefined();
    });

    test('error log is emitted for failed response', async () => {
        const jsonLogger = new JSONLogger();
        LoggerRegistry.getInstance().registerLogger(jsonLogger);
        const loggerSpy = jest.spyOn(jsonLogger, 'log');
        const httpClient = new FetchHttpClient(
            new URL('https://mainnet.vechain.org/invalid')
        );
        const response = await httpClient.get();
        expect(response.status).toBe(403);
        const callArgs = loggerSpy.mock.calls[0][0];
        expect(callArgs).toMatchObject({
            verbosity: 'error',
            message: 'HTTP Response',
            source: 'FetchHttpClient'
        });
        expect(callArgs.context).toBeDefined();
    });
});
