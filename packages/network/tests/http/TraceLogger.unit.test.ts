import { describe, expect } from '@jest/globals';
import { SimpleHttpClient } from '../../src';
import {
    logRequest,
    logResponse,
    logError,
    isTraceEnabled
} from '../../src/http/trace-logger';

/**
 * Test trace-logger functionality with SimpleHttpClient.
 *
 * @group unit/http/logging
 */
describe('HTTP Trace Logger', () => {
    // Save original environment and console.log
    const originalEnv = process.env.SDK_TRACE;
    const originalConsoleLog = console.log;

    // Mock data to use in tests
    const mockUrl = 'http://localhost/api';
    const mockMethod = 'GET';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockBody = { test: 'data' };
    const mockResponse = { result: 'success' };
    const mockError = new Error('Test error');

    // Log capturing array
    let logCaptureArray: string[] = [];

    beforeEach(() => {
        // Reset mocks and capture array
        jest.resetAllMocks();
        logCaptureArray = [];

        // Mock console.log to capture output
        console.log = jest.fn((...args) => {
            logCaptureArray.push(
                args
                    .map((arg) =>
                        typeof arg === 'string' ? arg : JSON.stringify(arg)
                    )
                    .join(' ')
            );
        });
    });

    afterEach(() => {
        // Restore original console.log
        console.log = originalConsoleLog;

        // Restore original environment
        if (originalEnv === undefined) {
            delete process.env.SDK_TRACE;
        } else {
            process.env.SDK_TRACE = originalEnv;
        }
    });

    describe('isTraceEnabled function', () => {
        it('should return true when SDK_TRACE is set to "true"', () => {
            process.env.SDK_TRACE = 'true';
            expect(isTraceEnabled()).toBe(true);
        });

        it('should return true when SDK_TRACE is set to "1"', () => {
            process.env.SDK_TRACE = '1';
            expect(isTraceEnabled()).toBe(true);
        });

        it('should return false when SDK_TRACE is not set', () => {
            delete process.env.SDK_TRACE;
            expect(isTraceEnabled()).toBe(false);
        });

        it('should return false when SDK_TRACE is set to anything else', () => {
            process.env.SDK_TRACE = 'false';
            expect(isTraceEnabled()).toBe(false);
        });
    });

    describe('Logger functions', () => {
        it('should log request when trace is enabled', () => {
            process.env.SDK_TRACE = 'true';

            const timestamp = logRequest(
                mockMethod,
                mockUrl,
                mockHeaders,
                mockBody
            );

            expect(timestamp).toBeDefined();
            expect(typeof timestamp).toBe('number');
            expect(logCaptureArray.length).toBeGreaterThan(0);
            expect(
                logCaptureArray.some((log) => log.includes('HTTP Request'))
            ).toBe(true);
            expect(logCaptureArray.some((log) => log.includes(mockUrl))).toBe(
                true
            );
            expect(
                logCaptureArray.some((log) => log.includes('Content-Type'))
            ).toBe(true);
            expect(logCaptureArray.some((log) => log.includes('test'))).toBe(
                true
            );
        });

        it('should not log request when trace is disabled', () => {
            delete process.env.SDK_TRACE;

            const timestamp = logRequest(
                mockMethod,
                mockUrl,
                mockHeaders,
                mockBody
            );

            expect(timestamp).toBeDefined();
            expect(typeof timestamp).toBe('number');
            expect(logCaptureArray.length).toBe(0);
        });

        it('should log response when trace is enabled', () => {
            process.env.SDK_TRACE = 'true';
            const startTimestamp = Date.now() - 100; // Simulate request started 100ms ago

            logResponse(startTimestamp, mockUrl, mockHeaders, mockResponse);

            expect(logCaptureArray.length).toBeGreaterThan(0);
            expect(
                logCaptureArray.some((log) => log.includes('HTTP Response'))
            ).toBe(true);
            expect(logCaptureArray.some((log) => log.includes(mockUrl))).toBe(
                true
            );
            expect(logCaptureArray.some((log) => log.includes('ms'))).toBe(
                true
            ); // Duration should be logged
        });

        it('should not log response when trace is disabled', () => {
            delete process.env.SDK_TRACE;
            const startTimestamp = Date.now() - 100;

            logResponse(startTimestamp, mockUrl, mockHeaders, mockResponse);

            expect(logCaptureArray.length).toBe(0);
        });

        it('should log error when trace is enabled', () => {
            process.env.SDK_TRACE = 'true';
            const startTimestamp = Date.now() - 100;

            logError(startTimestamp, mockUrl, mockMethod, mockError);

            expect(logCaptureArray.length).toBeGreaterThan(0);
            expect(
                logCaptureArray.some((log) => log.includes('HTTP Error'))
            ).toBe(true);
            expect(logCaptureArray.some((log) => log.includes(mockUrl))).toBe(
                true
            );
            expect(logCaptureArray.some((log) => log.includes('Error:'))).toBe(
                true
            );
            expect(
                logCaptureArray.some((log) => log.includes('Test error'))
            ).toBe(true);
        });

        it('should not log error when trace is disabled', () => {
            delete process.env.SDK_TRACE;
            const startTimestamp = Date.now() - 100;

            logError(startTimestamp, mockUrl, mockMethod, mockError);

            expect(logCaptureArray.length).toBe(0);
        });
    });

    describe('SimpleHttpClient with trace logger', () => {
        it('should log HTTP requests and responses when trace is enabled', async () => {
            process.env.SDK_TRACE = 'true';

            // Mock fetch to return successful response
            jest.spyOn(globalThis, 'fetch').mockImplementation(
                jest.fn().mockResolvedValueOnce({
                    json: async () => await Promise.resolve(mockResponse),
                    ok: true,
                    headers: {
                        entries: () => [['Content-Type', 'application/json']]
                    }
                })
            );

            const client = new SimpleHttpClient(mockUrl);
            await client.get('/test');

            // Verify logging output
            expect(logCaptureArray.length).toBeGreaterThan(0);
            expect(
                logCaptureArray.some((log) => log.includes('HTTP Request'))
            ).toBe(true);
            expect(
                logCaptureArray.some((log) => log.includes('HTTP Response'))
            ).toBe(true);
            expect(logCaptureArray.some((log) => log.includes('/test'))).toBe(
                true
            );
        });

        it('should log HTTP request and error when trace is enabled and request fails', async () => {
            process.env.SDK_TRACE = 'true';

            // Mock fetch to throw an error
            jest.spyOn(globalThis, 'fetch').mockImplementation(
                jest.fn().mockRejectedValueOnce(new Error('Network error'))
            );

            const client = new SimpleHttpClient(mockUrl);

            try {
                await client.get('/test');
                fail('Should have thrown an error');
            } catch {
                // Verify logging output
                expect(logCaptureArray.length).toBeGreaterThan(0);
                expect(
                    logCaptureArray.some((log) => log.includes('HTTP Request'))
                ).toBe(true);
                expect(
                    logCaptureArray.some((log) => log.includes('HTTP Error'))
                ).toBe(true);
                expect(
                    logCaptureArray.some((log) => log.includes('Network error'))
                ).toBe(true);
            }
        });

        it('should not log HTTP requests and responses when trace is disabled', async () => {
            delete process.env.SDK_TRACE;

            // Mock fetch to return successful response
            jest.spyOn(globalThis, 'fetch').mockImplementation(
                jest.fn().mockResolvedValueOnce({
                    json: async () => await Promise.resolve(mockResponse),
                    ok: true,
                    headers: {
                        entries: () => [['Content-Type', 'application/json']]
                    }
                })
            );

            const client = new SimpleHttpClient(mockUrl);
            await client.get('/test');

            // Verify no logging output
            expect(logCaptureArray.length).toBe(0);
        });
    });
});
