"use strict";
/**
 * HTTP trace logger for detailed request/response logging
 *
 * This logger is only activated when the SDK_TRACE environment variable is set to 'true'
 * It helps developers debug the exact HTTP traffic between the SDK and Thor nodes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logResponse = exports.logRequest = exports.isTraceEnabled = void 0;
/**
 * Checks if trace logging is enabled via environment variable
 */
const isTraceEnabled = () => {
    const value = process?.env?.SDK_TRACE?.toLowerCase();
    return value === 'true' || value === '1';
};
exports.isTraceEnabled = isTraceEnabled;
/**
 * Logs HTTP request details before sending
 */
const logRequest = (method, url, headers, body) => {
    if (!(0, exports.isTraceEnabled)()) {
        return Date.now(); // Return timestamp for duration calculation but don't log
    }
    const timestamp = Date.now();
    const data = {
        category: 'HTTP Request',
        method,
        url,
        requestHeaders: headers,
        requestBody: body,
        timestamp
    };
    console.log(`\n⚡ [TRACE] HTTP Request (${new Date(timestamp).toISOString()})`);
    console.log(`➡️ ${JSON.stringify(data, null, 2)}`);
    if (headers != null && Object.keys(headers).length > 0) {
        console.log('📋 Headers:');
        Object.entries(headers).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
    }
    if (body !== undefined) {
        console.log('📦 Body:');
        try {
            console.log(typeof body === 'string' ? body : JSON.stringify(body, null, 2));
        }
        catch {
            console.log('[Complex body object]');
        }
    }
    return timestamp;
};
exports.logRequest = logRequest;
/**
 * Logs HTTP response details after receiving
 */
const logResponse = (startTimestamp, url, responseHeaders, responseBody) => {
    if (!(0, exports.isTraceEnabled)()) {
        return;
    }
    const endTimestamp = Date.now();
    const duration = endTimestamp - startTimestamp;
    const data = {
        category: 'HTTP Response',
        url,
        responseHeaders,
        responseBody,
        timestamp: endTimestamp,
        duration
    };
    console.log(`\n⚡ [TRACE] HTTP Response (${new Date(endTimestamp).toISOString()})`);
    console.log(`➡️ ${JSON.stringify(data, null, 2)}`);
    console.log(`⬅️ ${url} (${duration}ms)`);
    if (responseHeaders != null && Object.keys(responseHeaders).length > 0) {
        console.log('📋 Headers:');
        Object.entries(responseHeaders).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
    }
    if (responseBody !== null) {
        console.log('📦 Body:');
        try {
            console.log(typeof responseBody === 'string'
                ? responseBody
                : JSON.stringify(responseBody, null, 2));
        }
        catch {
            console.log('[Complex response body]');
        }
    }
};
exports.logResponse = logResponse;
/**
 * Logs HTTP error details
 */
const logError = (startTimestamp, url, method, error) => {
    if (!(0, exports.isTraceEnabled)()) {
        return;
    }
    const endTimestamp = Date.now();
    const duration = endTimestamp - startTimestamp;
    const data = {
        category: 'HTTP Error',
        method,
        url,
        error,
        timestamp: endTimestamp,
        duration
    };
    console.log(`\n⚡ [TRACE] HTTP Error (${new Date(endTimestamp).toISOString()})`);
    console.log(`➡️ ${JSON.stringify(data, null, 2)}`);
    console.log(`❌ ${method} ${url} (${duration}ms)`);
    console.log('⛔ Error:');
    if (error !== null && error !== undefined && error instanceof Error) {
        console.log(`   ${error.name}: ${error.message}`);
        if (error.stack != null) {
            console.log(`   Stack: ${error.stack}`);
        }
        if ('cause' in error && error.cause != null) {
            console.log('   Cause:');
            console.log(error.cause);
        }
    }
    else {
        console.log(error);
    }
};
exports.logError = logError;
