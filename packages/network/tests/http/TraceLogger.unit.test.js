"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
const trace_logger_1 = require("../../src/http/trace-logger");
/**
 * Test trace-logger functionality with SimpleHttpClient.
 *
 * @group unit/http/logging
 */
(0, globals_1.describe)('HTTP Trace Logger', () => {
    // Save original console.log
    const originalConsoleLog = console.log;
    // Mutable test-local state
    let originalEnv;
    let logCaptureArray = [];
    // Mock data to use in tests
    const mockUrl = 'http://localhost/api';
    const mockMethod = 'GET';
    const mockHeaders = { 'Content-Type': 'application/json' };
    const mockBody = { test: 'data' };
    const mockResponse = { result: 'success' };
    const mockError = new Error('Test error');
    beforeEach(() => {
        // Save current environment variable
        originalEnv = process.env.SDK_TRACE;
        // Reset mocks and capture array
        jest.resetAllMocks();
        logCaptureArray = [];
        // Mock console.log to capture output
        console.log = jest.fn((...args) => {
            logCaptureArray.push(args
                .map((arg) => typeof arg === 'string' ? arg : JSON.stringify(arg))
                .join(' '));
        });
    });
    afterEach(() => {
        // Restore original console.log
        console.log = originalConsoleLog;
        // Restore original environment
        if (originalEnv === undefined) {
            delete process.env.SDK_TRACE;
        }
        else {
            process.env.SDK_TRACE = originalEnv;
        }
    });
    (0, globals_1.describe)('isTraceEnabled function', () => {
        it('should return true when SDK_TRACE is set to "true"', () => {
            process.env.SDK_TRACE = 'true';
            (0, globals_1.expect)((0, trace_logger_1.isTraceEnabled)()).toBe(true);
        });
        it('should return true when SDK_TRACE is set to "1"', () => {
            process.env.SDK_TRACE = '1';
            (0, globals_1.expect)((0, trace_logger_1.isTraceEnabled)()).toBe(true);
        });
        it('should return false when SDK_TRACE is not set', () => {
            delete process.env.SDK_TRACE;
            (0, globals_1.expect)((0, trace_logger_1.isTraceEnabled)()).toBe(false);
        });
        it('should return false when SDK_TRACE is set to anything else', () => {
            process.env.SDK_TRACE = 'false';
            (0, globals_1.expect)((0, trace_logger_1.isTraceEnabled)()).toBe(false);
        });
    });
    (0, globals_1.describe)('Logger functions', () => {
        it('should log request when trace is enabled', () => {
            process.env.SDK_TRACE = 'true';
            const timestamp = (0, trace_logger_1.logRequest)(mockMethod, mockUrl, mockHeaders, mockBody);
            (0, globals_1.expect)(timestamp).toBeDefined();
            (0, globals_1.expect)(typeof timestamp).toBe('number');
            (0, globals_1.expect)(logCaptureArray.length).toBeGreaterThan(0);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('HTTP Request'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes(mockUrl))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('Content-Type'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('test'))).toBe(true);
        });
        it('should not log request when trace is disabled', () => {
            delete process.env.SDK_TRACE;
            const timestamp = (0, trace_logger_1.logRequest)(mockMethod, mockUrl, mockHeaders, mockBody);
            (0, globals_1.expect)(timestamp).toBeDefined();
            (0, globals_1.expect)(typeof timestamp).toBe('number');
            (0, globals_1.expect)(logCaptureArray.length).toBe(0);
        });
        it('should log response when trace is enabled', () => {
            process.env.SDK_TRACE = 'true';
            const startTimestamp = Date.now() - 100; // Simulate request started 100ms ago
            (0, trace_logger_1.logResponse)(startTimestamp, mockUrl, mockHeaders, mockResponse);
            (0, globals_1.expect)(logCaptureArray.length).toBeGreaterThan(0);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('HTTP Response'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes(mockUrl))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('ms'))).toBe(true); // Duration should be logged
        });
        it('should not log response when trace is disabled', () => {
            delete process.env.SDK_TRACE;
            const startTimestamp = Date.now() - 100;
            (0, trace_logger_1.logResponse)(startTimestamp, mockUrl, mockHeaders, mockResponse);
            (0, globals_1.expect)(logCaptureArray.length).toBe(0);
        });
        it('should log error when trace is enabled', () => {
            process.env.SDK_TRACE = 'true';
            const startTimestamp = Date.now() - 100;
            (0, trace_logger_1.logError)(startTimestamp, mockUrl, mockMethod, mockError);
            (0, globals_1.expect)(logCaptureArray.length).toBeGreaterThan(0);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('HTTP Error'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes(mockUrl))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('Error:'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('Test error'))).toBe(true);
        });
        it('should not log error when trace is disabled', () => {
            delete process.env.SDK_TRACE;
            const startTimestamp = Date.now() - 100;
            (0, trace_logger_1.logError)(startTimestamp, mockUrl, mockMethod, mockError);
            (0, globals_1.expect)(logCaptureArray.length).toBe(0);
        });
    });
    (0, globals_1.describe)('SimpleHttpClient with trace logger', () => {
        it('should log HTTP requests and responses when trace is enabled', async () => {
            process.env.SDK_TRACE = 'true';
            // Mock fetch to return successful response
            jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce({
                json: async () => await Promise.resolve(mockResponse),
                ok: true,
                headers: {
                    entries: () => [['Content-Type', 'application/json']]
                }
            }));
            const client = new src_1.SimpleHttpClient(mockUrl);
            await client.get('/test');
            // Verify logging output
            (0, globals_1.expect)(logCaptureArray.length).toBeGreaterThan(0);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('HTTP Request'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('HTTP Response'))).toBe(true);
            (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('/test'))).toBe(true);
        });
        it('should log HTTP request and error when trace is enabled and request fails', async () => {
            process.env.SDK_TRACE = 'true';
            // Mock fetch to throw an error
            jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockRejectedValueOnce(new Error('Network error')));
            const client = new src_1.SimpleHttpClient(mockUrl);
            try {
                await client.get('/test');
                fail('Should have thrown an error');
            }
            catch {
                // Verify logging output
                (0, globals_1.expect)(logCaptureArray.length).toBeGreaterThan(0);
                (0, globals_1.expect)(logCaptureArray.some((log) => log.includes('HTTP Request'))).toBe(true);
            }
        });
        it('should not log HTTP requests and responses when trace is disabled', async () => {
            delete process.env.SDK_TRACE;
            // Mock fetch to return successful response
            jest.spyOn(globalThis, 'fetch').mockImplementation(jest.fn().mockResolvedValueOnce({
                json: async () => await Promise.resolve(mockResponse),
                ok: true,
                headers: {
                    entries: () => [['Content-Type', 'application/json']]
                }
            }));
            const client = new src_1.SimpleHttpClient(mockUrl);
            await client.get('/test');
            // Verify no logging output
            (0, globals_1.expect)(logCaptureArray.length).toBe(0);
        });
    });
});
