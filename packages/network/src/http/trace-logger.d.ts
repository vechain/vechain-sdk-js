/**
 * HTTP trace logger for detailed request/response logging
 *
 * This logger is only activated when the SDK_TRACE environment variable is set to 'true'
 * It helps developers debug the exact HTTP traffic between the SDK and Thor nodes
 */
/**
 * Checks if trace logging is enabled via environment variable
 */
export declare const isTraceEnabled: () => boolean;
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
export declare const logRequest: (method: string, url: string, headers?: Record<string, string>, body?: unknown) => number;
/**
 * Logs HTTP response details after receiving
 */
export declare const logResponse: (startTimestamp: number, url: string, responseHeaders?: Record<string, string>, responseBody?: unknown) => void;
/**
 * Logs HTTP error details
 */
export declare const logError: (startTimestamp: number, url: string, method: string, error: unknown) => void;
//# sourceMappingURL=trace-logger.d.ts.map