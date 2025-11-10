import {
    afterAll,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { FetchHttpClient } from '@common/http';
import { ThorNetworks } from '@thor/utils/const/network';

// Mock Headers class since it's not available in Node.js environment
class MockHeaders {
    private headers: Record<string, string> = {};

    append(name: string, value: string): void {
        this.headers[name.toLowerCase()] = value;
    }

    get(name: string): string | null {
        return this.headers[name.toLowerCase()] ?? null;
    }

    has(name: string): boolean {
        return name.toLowerCase() in this.headers;
    }

    set(name: string, value: string): void {
        this.headers[name.toLowerCase()] = value;
    }

    delete(name: string): void {
        const lowerCaseName = name.toLowerCase();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.headers[lowerCaseName];
    }
}

// Create a simple MockRequest class for testing
class MockRequest {
    url: string;
    method: string;
    _body: string | null;
    headers: Headers;
    signal: AbortSignal | null;

    constructor(url: string | URL, init?: RequestInit) {
        this.url = url.toString();
        this.method = init?.method ?? 'GET';
        this._body =
            init?.body !== undefined
                ? typeof init.body === 'string'
                    ? init.body
                    : JSON.stringify(init.body)
                : null;
        this.headers = new Headers(init?.headers);
        this.signal = init?.signal ?? null;
    }

    async text(): Promise<string> {
        // Add await for a dummy promise to satisfy require-await
        await Promise.resolve();
        return this._body ?? '';
    }

    async json(): Promise<unknown> {
        // Add await for a dummy promise to satisfy require-await
        await Promise.resolve();
        if (this._body === null) return null;
        return JSON.parse(this._body) as unknown;
    }

    clone(): MockRequest {
        const req = new MockRequest(this.url, {
            method: this.method,
            body: this._body ?? undefined
        });
        this.headers.forEach((value, key) => {
            req.headers.set(key, value);
        });
        return req;
    }
}

// Store the original fetch for restoration
const originalFetch = global.fetch;

// Create a typed mock fetch function and install it
const mockFetch = jest.fn() as unknown as typeof fetch;
global.fetch = mockFetch;

interface MockResponse {
    status: string;
    success: boolean;
}

interface TestRequestBody {
    data: string;
    value: number;
}

interface TestResponse {
    received: TestRequestBody;
}

interface MockResponseObject {
    ok: boolean;
    status: number;
    statusText: string;
    headers: MockHeaders;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
    body: null;
    bodyUsed: boolean;
    redirected: boolean;
    type: ResponseType;
    url: string;
    clone: () => unknown;
    arrayBuffer: () => Promise<ArrayBuffer>;
    blob: () => Promise<Blob>;
    formData: () => Promise<FormData>;
}

/**
 * Helper function to create a mock Response
 */
const createMockResponse = <T>(response: T, ok = true): Response => {
    // Create a mock Response object with the minimum required properties
    const mockResponse: MockResponseObject = {
        ok,
        status: ok ? 200 : 400,
        statusText: ok ? 'OK' : 'Bad Request',
        headers: new MockHeaders(),
        json: async () => {
            await Promise.resolve(); // Add await to satisfy require-await
            return response;
        },
        text: async () => {
            await Promise.resolve(); // Add await to satisfy require-await
            return JSON.stringify(response);
        },
        body: null,
        bodyUsed: false,
        redirected: false,
        type: 'basic' as ResponseType,
        url: '',
        clone: function () {
            return this;
        },
        arrayBuffer: async () => {
            await Promise.resolve(); // Add await to satisfy require-await
            return new ArrayBuffer(0);
        },
        blob: async () => {
            await Promise.resolve(); // Add await to satisfy require-await
            return new Blob();
        },
        formData: async () => {
            await Promise.resolve(); // Add await to satisfy require-await
            return new FormData();
        }
    };

    return mockResponse as unknown as Response;
};

// Define a type for the RequestConstructor to avoid using any
type RequestConstructor = typeof Request;

/**
 * VeChain FetchHttpClient - unit tests
 *
 * @group unit/http
 */
describe('FetchHttpClient unit tests', () => {
    beforeEach(() => {
        // Reset mock between tests
        (mockFetch as jest.Mock).mockReset();
    });

    afterAll(() => {
        // Restore mocks
        global.fetch = originalFetch;
    });

    describe('constructor', () => {
        test('should create client with valid URL', () => {
            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    onRequest: (req) => req,
                    onResponse: (res) => res
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            expect(client.baseURL.toString()).toBe(ThorNetworks.TESTNET);
        });

        test('should add trailing slash to URL if missing', () => {
            const url = new URL('https://testnet.vechain.org');
            const client = new FetchHttpClient(
                url,
                {
                    onRequest: (req) => req,
                    onResponse: (res) => res
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            expect(client.baseURL.toString()).toBe(
                'https://testnet.vechain.org/'
            );
        });
    });

    describe('static at', () => {
        test('should create client with string URL', () => {
            const client = FetchHttpClient.at(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );
            expect(client.baseURL.toString()).toBe(ThorNetworks.TESTNET);
        });

        test('should use default handlers when not provided', () => {
            const client = FetchHttpClient.at(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );
            // We can't easily test private properties, but we can test
            // that the client is created correctly
            expect(client).toBeInstanceOf(FetchHttpClient);
        });
    });

    describe('get', () => {
        test('should make GET request with default parameters', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            const response = await client.get();
            const data = (await response.json()) as MockResponse;

            // Validate fetch was called and the handler processed the response
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(data).toEqual(mockResponse);

            // Validate the URL that fetch was called with
            const requestArg = (mockFetch as jest.Mock).mock.calls[0][0];
            expect(requestArg).toBeDefined();
            expect(requestArg instanceof MockRequest).toBe(true);
            expect((requestArg as MockRequest).url).toBe(ThorNetworks.TESTNET);
        });

        test('should make GET request with custom path', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            const response = await client.get({ path: 'accounts' });
            const data = (await response.json()) as MockResponse;

            expect(mockFetch).toHaveBeenCalledTimes(1);

            // Validate the request URL
            const requestArg = (mockFetch as jest.Mock).mock.calls[0][0];
            expect(requestArg).toBeDefined();
            expect((requestArg as MockRequest).url).toBe(
                ThorNetworks.TESTNET + 'accounts'
            );

            expect(data).toEqual(mockResponse);
        });

        test('should handle leading slash in path correctly', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            const response = await client.get({ path: '/accounts' });
            const data = (await response.json()) as MockResponse;

            expect(mockFetch).toHaveBeenCalledTimes(1);

            // Validate the request URL has the leading slash removed
            const requestArg = (mockFetch as jest.Mock).mock.calls[0][0];
            expect(requestArg).toBeDefined();
            expect((requestArg as MockRequest).url).toBe(
                ThorNetworks.TESTNET + 'accounts'
            );

            expect(data).toEqual(mockResponse);
        });

        test('should include query parameters in URL', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await client.get({ path: 'accounts' }, { query: 'address=0x123' });

            expect(mockFetch).toHaveBeenCalledTimes(1);

            // Validate the request URL includes query parameters
            const requestArg = (mockFetch as jest.Mock).mock.calls[0][0];
            expect(requestArg).toBeDefined();
            expect((requestArg as MockRequest).url).toBe(
                ThorNetworks.TESTNET + 'accounts?address=0x123'
            );
        });

        test('should call onRequest and onResponse handlers', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            let requestWasCalled = false;
            let responseWasCalled = false;

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    onRequest: (req) => {
                        requestWasCalled = true;
                        return req;
                    },
                    onResponse: (res) => {
                        responseWasCalled = true;
                        return res;
                    }
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await client.get();

            expect(requestWasCalled).toBe(true);
            expect(responseWasCalled).toBe(true);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('should handle fetch errors', async () => {
            (mockFetch as jest.Mock).mockRejectedValueOnce(
                new Error('Network error') as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await expect(client.get()).rejects.toThrow('Network error');
        });
    });

    describe('post', () => {
        test('should make POST request with JSON body', async () => {
            const requestBody: TestRequestBody = {
                data: 'test',
                value: 123
            };
            const mockResponse: TestResponse = {
                received: requestBody
            };

            (mockFetch as jest.Mock).mockImplementation(
                async (request: unknown) => {
                    // Add await for a dummy promise to satisfy require-await
                    await Promise.resolve();

                    // Validate request properties
                    expect(request instanceof MockRequest).toBe(true);
                    const req = request as MockRequest;
                    expect(req.url).toBe(ThorNetworks.TESTNET + 'transactions');
                    expect(req.method).toBe('POST');

                    // Validate body contains our data
                    const body = await req.text();
                    const parsedBody = JSON.parse(body) as TestRequestBody;
                    expect(parsedBody).toEqual(requestBody);

                    return createMockResponse(mockResponse);
                }
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            const response = await client.post(
                { path: 'transactions' },
                { query: '' },
                requestBody
            );
            const data = (await response.json()) as TestResponse;

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(data).toEqual(mockResponse);
        });

        test('should handle POST request without body', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };

            (mockFetch as jest.Mock).mockImplementation(
                async (request: unknown) => {
                    // Add await for a dummy promise to satisfy require-await
                    await Promise.resolve();

                    // Validate request properties
                    expect(request instanceof MockRequest).toBe(true);
                    const req = request as MockRequest;
                    expect(req.url).toBe(ThorNetworks.TESTNET + 'ping');
                    expect(req.method).toBe('POST');

                    return createMockResponse(mockResponse);
                }
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            const response = await client.post({ path: 'ping' });
            const data = (await response.json()) as MockResponse;

            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(data).toEqual(mockResponse);
        });

        test('should call onRequest and onResponse handlers for POST requests', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            let requestWasCalled = false;
            let responseWasCalled = false;

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    onRequest: (req) => {
                        requestWasCalled = true;
                        return req;
                    },
                    onResponse: (res) => {
                        responseWasCalled = true;
                        return res;
                    }
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await client.post({ path: 'transactions' });

            expect(requestWasCalled).toBe(true);
            expect(responseWasCalled).toBe(true);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });

        test('should handle failed responses', async () => {
            const errorResponse = { error: 'Bad request', code: 400 };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(errorResponse, false) as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {},
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await expect(client.post({ path: 'transactions' })).rejects.toThrow(
                'HTTP request failed with status 400'
            );
        });
    });

    describe('custom headers', () => {
        test('should include custom headers', async () => {
            const mockResponse: MockResponse = {
                status: 'success',
                success: true
            };
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse(mockResponse) as never
            );

            const customHeaders = {
                'Content-Type': 'application/json'
            };

            let validHeaders = false;

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    onRequest: (req) => {
                        if (
                            Object.keys(customHeaders).length > 0 &&
                            Object.entries(customHeaders).every(
                                ([key, value]) => req.headers.get(key) === value
                            )
                        ) {
                            validHeaders = true;
                        }
                        return req;
                    },
                    headers: customHeaders
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await client.post({ path: 'transactions' });

            expect(validHeaders).toBe(true);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('cookie storage', () => {
        test('should store cookies from response', async () => {
            // Create a mock response with a Set-Cookie header
            const mockResponseOptions: MockResponse = {
                status: 'success',
                success: true
            };
            const mockResponse = createMockResponse(mockResponseOptions);
            mockResponse.headers.set('Set-Cookie', 'test=123');
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                mockResponse as never
            );

            // send request with cookie storage enabled
            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    storeCookies: true
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            // send request with cookie storage enabled
            await client.post({ path: 'transactions' });

            // validate that the cookie was stored
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            expect((client as any).cookieStore.cookies.get('test')).toBe('123');

            // validate that the cookie was sent in the request
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
        test('should send cookies in requests', async () => {
            let cookieWasSent = false;

            // Mock fetch to return a valid response
            (mockFetch as jest.Mock).mockResolvedValueOnce(
                createMockResponse({ status: 'success' }) as never
            );

            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    onRequest: (req) => {
                        const cookie = req.headers.get('cookie');
                        if (cookie !== null) {
                            if (cookie.includes('test=123')) {
                                cookieWasSent = true;
                            }
                        }
                        return req;
                    },
                    storeCookies: true
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );
            // add item to cookie store
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            (client as any).cookieStore.cookies.set('test', '123');

            // send request with cookie storage enabled
            await client.post({ path: 'transactions' });

            // validate that the cookie was sent in the request
            expect(cookieWasSent).toBe(true);
            expect(mockFetch).toHaveBeenCalledTimes(1);
        });
    });

    describe('timeout', () => {
        test('should timeout', async () => {
            (mockFetch as jest.Mock).mockImplementation(
                async (request: unknown) => {
                    const req = request as MockRequest;
                    // Check if request was aborted before starting the delay
                    if ((req as unknown as Request).signal?.aborted) {
                        throw new Error('AbortError');
                    }

                    await new Promise((resolve) => setTimeout(resolve, 2000));

                    // Check again after the delay
                    if ((req as unknown as Request).signal?.aborted) {
                        throw new Error('AbortError');
                    }
                    return createMockResponse({ status: 'success' });
                }
            );
            const client = new FetchHttpClient(
                new URL(ThorNetworks.TESTNET),
                {
                    timeout: 1000
                },
                MockRequest as unknown as RequestConstructor,
                mockFetch
            );

            await expect(client.get()).rejects.toThrow('AbortError');
        });
    });
});
