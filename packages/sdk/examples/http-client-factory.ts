/**
 * Example demonstrating the transport-based API in PublicClient
 * 
 * This example shows how to:
 * 1. Use the default transport (FetchHttpClient)
 * 2. Create a custom HttpClient implementation
 * 3. Inject a custom transport for testing or custom behavior
 */

import { 
    createPublicClient, 
    type HttpClient, 
    type HttpPath,
    type HttpQuery,
    FetchHttpClient 
} from '../src';
import { type HttpOptions } from '../src/http/HttpOptions';

// Example 1: Using the default transport (standard usage)
const defaultClient = createPublicClient({
    chain: 'https://testnet.vechain.org'
    // transport is optional - uses FetchHttpClient if not provided
});

// Example 2: Creating a custom HttpClient for testing or special behavior
class MockHttpClient implements HttpClient {
    public readonly baseURL: URL;
    public readonly options: HttpOptions;

    constructor(baseURL: URL, options: HttpOptions = {}) {
        this.baseURL = baseURL;
        this.options = options;
    }

    async get(httpPath: HttpPath, httpQuery: HttpQuery): Promise<Response> {
        // Mock implementation - return fake data for testing
        return new Response(JSON.stringify({ 
            balance: '1000000000000000000', // 1 VET
            energy: '5000000000000000000'   // 5 VTHO
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async post(httpPath: HttpPath, httpQuery: HttpQuery, body?: unknown): Promise<Response> {
        // Mock implementation
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Example 3: Using a custom transport (useful for testing)
const testClient = createPublicClient({
    chain: 'https://testnet.vechain.org',
    transport: new MockHttpClient(new URL('https://testnet.vechain.org'))
});

// Example 4: Using FetchHttpClient with custom options
const clientWithCustomOptions = createPublicClient({
    chain: 'https://mainnet.vechain.org',
    transport: new FetchHttpClient(new URL('https://mainnet.vechain.org'), {
        timeout: 10000,
        headers: {
            'User-Agent': 'MyApp/1.0',
            'X-Custom-Header': 'custom-value'
        }
    })
});

// Example 5: Using FetchHttpClient with onRequest callback (like your example)
const clientWithCallbacks = createPublicClient({
    chain: 'https://mainnet.vechain.org',
    transport: new FetchHttpClient(new URL('https://mainnet.vechain.org'), {
        onRequest: (request) => {
            console.log(`method: ${request.method}`);
            return request;
        },
        timeout: 5000
    })
});

// Usage examples
async function demonstrateUsage() {
    try {
        // All clients have the same interface regardless of the transport used
        const balance1 = await defaultClient.getBalance('0x...');
        const balance2 = await testClient.getBalance('0x...');
        const balance3 = await clientWithCustomOptions.getBalance('0x...');
        const balance4 = await clientWithCallbacks.getBalance('0x...');

        console.log('Default client balance:', balance1);
        console.log('Test client balance:', balance2);
        console.log('Custom options client balance:', balance3);
        console.log('Callbacks client balance:', balance4);
    } catch (error) {
        console.error('Error:', error);
    }
}

export {
    MockHttpClient,
    demonstrateUsage
};
