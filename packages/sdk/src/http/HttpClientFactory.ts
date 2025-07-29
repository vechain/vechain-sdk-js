import { type HttpClient } from './HttpClient';
import { type HttpOptions } from './HttpOptions';
import { FetchHttpClient } from './FetchHttpClient';

/**
 * Factory interface for creating HttpClient instances.
 * Enables dependency injection and testing by allowing custom HttpClient implementations.
 */
export interface HttpClientFactory {
    /**
     * Creates an HttpClient instance for the given base URL and options.
     * @param baseURL - The base URL for the HTTP client
     * @param options - Optional HTTP configuration options
     * @returns A configured HttpClient instance
     */
    create(baseURL: URL, options?: HttpOptions): HttpClient;
}

/**
 * Default factory implementation that creates FetchHttpClient instances.
 * Uses the standard Fetch API implementation.
 */
export class DefaultHttpClientFactory implements HttpClientFactory {
    create(baseURL: URL, options: HttpOptions = {}): HttpClient {
        return new FetchHttpClient(baseURL, options);
    }
}
