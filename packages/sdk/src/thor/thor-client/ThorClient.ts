import { AccountsModule } from './accounts/accounts-module';
import { FetchHttpClient, type HttpClient } from '@http';

/**
 * The `ThorClient` class serves as an abstractedinterface to interact with the VeChainThor blockchain.
 */
class ThorClient {
    /**
     * The `AccountsModule` instance
     */
    public readonly accounts: AccountsModule;

    /**
     * Constructs a new `ThorClient` instance with a given HTTPClient
     *
     * @param httpClient - The HTTP client instance used for making network requests.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(readonly httpClient: HttpClient) {
        this.accounts = new AccountsModule(httpClient);
    }

    /**
     * Creates a new `ThorClient` instance from a given URL.
     *
     * @param {HttpClient} httpClient - The HTTP client instance used for making network requests.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     */
    public static at(httpClient: HttpClient): ThorClient {
        return new ThorClient(httpClient);
    }

    /**
     * Creates a ThorClient instance from a URL.
     *
     * @param {string} networkUrl - The URL of the network to connect to.
     * @param {BlocksModuleOptions} [options] - Optional configuration settings for the Blocks module.
     * @return {ThorClient} A ThorClient instance connected to the specified network URL.
     *
     * @deprecated Use {@link ThorClient.at} instead.
     */
    public static fromUrl(networkUrl: string): ThorClient {
        return ThorClient.at(new FetchHttpClient(new URL(networkUrl)));
    }
}

export { ThorClient };
