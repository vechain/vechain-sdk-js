import type { HttpClient } from '@common/http';

/**
 * Forward reference interface to avoid circular dependency with ThorClient.
 * This interface matches the structure of ThorClient without importing it.
 */
export interface IThorClient {
    readonly httpClient: HttpClient;
    readonly accounts: unknown;
    readonly blocks: unknown;
    readonly gas: unknown;
    readonly logs: unknown;
    readonly nodes: unknown;
    readonly contracts: unknown;
    readonly transactions: unknown;
}

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
    public thorClient!: IThorClient;

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
    public setThorClient(thorClient: IThorClient): void {
        this.thorClient = thorClient;
    }
}
