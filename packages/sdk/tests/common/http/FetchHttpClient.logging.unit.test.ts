import { FetchHttpClient, HttpException } from '@common/http';
import { JSONLogger, LoggerRegistry, type LogItem } from '@common/logging';
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loggerSpy.mockImplementation((entry: LogItem) => {});
        const httpClient = new FetchHttpClient(
            new URL('https://mainnet.vechain.org')
        );
        const response = await httpClient.get();
        expect(response.status).toBe(200);
        const callArgs = loggerSpy.mock.calls[0][0];
        expect(callArgs).toMatchObject({
            verbosity: 'debug',
            message: 'HTTP Response',
            source: 'FetchHttpClient'
        });
        expect(callArgs.context).toBeDefined();
    });

    test('error log is emitted for failed response', async () => {
        const jsonLogger = new JSONLogger();
        LoggerRegistry.getInstance().registerLogger(jsonLogger);
        const loggerSpy = jest.spyOn(jsonLogger, 'log');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loggerSpy.mockImplementation((entry: LogItem) => {});
        const httpClient = new FetchHttpClient(
            new URL('https://mainnet.vechain.org/invalid')
        );
        try {
            await httpClient.get();
            throw new Error('Should not reach here');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpException);
            const httpError = error as HttpException;
            expect(httpError.status).toBe(403);

            // Check that error logging was called
            const callArgs = loggerSpy.mock.calls[0][0];
            expect(callArgs).toMatchObject({
                verbosity: 'error',
                message: 'HTTP Response',
                source: 'FetchHttpClient'
            });
            expect(callArgs.context).toBeDefined();
        }
    });
});
