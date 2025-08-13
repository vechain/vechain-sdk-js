import type { HttpClient } from '@http';
import type { ThorClient } from './ThorClient';

/**
 * The `AbstractThorModule` class is the base class for all Thor modules.
 */
export abstract class AbstractThorModule {
    /**
     * The `HttpClient` instance used for making network requests.
     */
    public readonly httpClient: HttpClient;

    /**
     * The `ThorClient` instance.
     */
    public thorClient!: ThorClient;

    /**
     * Constructs a new `AbstractThorModule` instance.
     *
     * @param httpClient - The `HttpClient` instance used for making network requests.
     */
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Sets the `ThorClient` instance.
     *
     * @param thorClient - The `ThorClient` instance.
     */
    public setThorClient(thorClient: ThorClient): void {
        this.thorClient = thorClient;
    }
}
