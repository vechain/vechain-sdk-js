/**
 * HTTP trace logger for detailed request/response logging
 *
 * This logger is only activated when the SDK_TRACE environment variable is set to 'true'
 * It helps developers debug the exact HTTP traffic between the SDK and Thor nodes
 */

/**
 * Checks if trace logging is enabled via environment variable
 */
export const isTraceEnabled = (): boolean => {
    // Check environment variable - normalize to lowercase for case-insensitive comparison
    const traceEnv =
        typeof process !== 'undefined' && process.env
            ? process.env.SDK_TRACE?.toLowerCase()
            : undefined;
    return traceEnv === 'true' || traceEnv === '1';
};

/**
 * Interface for HTTP trace log data
 */
export interface TraceLogData {
    category: string;
    method?: string;
    url?: string;
    requestHeaders?: Record<string, string>;
    requestBody?: unknown;
    responseHeaders?: Record<string, string>;
    responseBody?: unknown;
    timestamp: number;
    duration?: number;
    error?: unknown;
}

/**
 * Logs HTTP request details before sending
 */
export const logRequest = (
    method: string,
    url: string,
    headers?: Record<string, string>,
    body?: unknown
): number => {
    if (!isTraceEnabled()) {
        return Date.now(); // Return timestamp for duration calculation but don't log
    }

    const timestamp = Date.now();
    const data: TraceLogData = {
        category: 'HTTP Request',
        method,
        url,
        requestHeaders: headers,
        requestBody: body,
        timestamp
    };

    console.log(
        `\n⚡ [TRACE] HTTP Request (${new Date(timestamp).toISOString()})`
    );
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
            console.log(
                typeof body === 'string' ? body : JSON.stringify(body, null, 2)
            );
        } catch {
            console.log('[Complex body object]');
        }
    }

    return timestamp;
};

/**
 * Logs HTTP response details after receiving
 */
export const logResponse = (
    startTimestamp: number,
    url: string,
    responseHeaders?: Record<string, string>,
    responseBody?: unknown
): void => {
    if (!isTraceEnabled()) {
        return;
    }

    const endTimestamp = Date.now();
    const duration = endTimestamp - startTimestamp;

    const data: TraceLogData = {
        category: 'HTTP Response',
        url,
        responseHeaders,
        responseBody,
        timestamp: endTimestamp,
        duration
    };

    console.log(
        `\n⚡ [TRACE] HTTP Response (${new Date(endTimestamp).toISOString()})`
    );
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
            console.log(
                typeof responseBody === 'string'
                    ? responseBody
                    : JSON.stringify(responseBody, null, 2)
            );
        } catch {
            console.log('[Complex response body]');
        }
    }
};

/**
 * Logs HTTP error details
 */
export const logError = (
    startTimestamp: number,
    url: string,
    method: string,
    error: unknown
): void => {
    if (!isTraceEnabled()) {
        return;
    }

    const endTimestamp = Date.now();
    const duration = endTimestamp - startTimestamp;

    const data: TraceLogData = {
        category: 'HTTP Error',
        method,
        url,
        error,
        timestamp: endTimestamp,
        duration
    };

    console.log(
        `\n⚡ [TRACE] HTTP Error (${new Date(endTimestamp).toISOString()})`
    );
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
    } else {
        console.log(error);
    }
};
