import { HttpException, HttpNetworkException } from '@common/http';
import { ThorError } from '../ThorError';

/**
 * Utility function to handle HTTP exceptions from FetchHttpClient and wrap them in ThorError.
 * 
 * @param fqp - The fully qualified path for error reporting
 * @param error - The error to handle
 * @returns A ThorError instance
 * @throws The original error if it's not an HTTP-related exception
 */
export function handleHttpError(fqp: string, error: unknown): ThorError {
    // Handle HTTP exceptions from FetchHttpClient
    if (error instanceof HttpException) {
        return new ThorError(
            fqp,
            error.responseBody,
            {
                url: error.url,
                status: error.status,
                statusText: error.statusText
            },
            error,
            error.status
        );
    }
    
    // Handle network exceptions from FetchHttpClient
    if (error instanceof HttpNetworkException) {
        return new ThorError(
            fqp,
            error.message,
            {
                url: error.url,
                networkErrorType: error.networkErrorType
            },
            error,
            0 // No HTTP status for network errors
        );
    }
    
    // Re-throw other errors
    throw error;
}
