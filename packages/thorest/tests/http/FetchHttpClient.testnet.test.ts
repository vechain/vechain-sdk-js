import { describe, test, expect } from '@jest/globals';
import { FetchHttpClient, ThorNetworks, toURL } from '../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

interface MockResponse {
    status: string;
}

interface TestRequestBody {
    data: string;
}

interface TestResponse {
    received: TestRequestBody;
}

const createMockResponse = <T>(response: T): Response => {
    const mockResponse: Partial<Response> = {
        ok: true,
        async json(): Promise<T> {
            await Promise.resolve(); // Add await to satisfy require-await
            return response;
        }
    };
    return mockResponse as Response;
};

/**
 * Test FetchHttpClient class.
 *
 * @group integration/network/http
 */
describe('FetchHttpClient testnet tests', () => {
    test('ok <- get', async () => {
        const mockResponse: MockResponse = { status: 'success' };
        let requestUrl: string | undefined;

        const client = new FetchHttpClient(
            toURL(ThorNetworks.TESTNET),
            (request: Request) => {
                requestUrl = request.url;
                return request;
            },
            () => createMockResponse(mockResponse)
        );

        const response = await client.get();
        const data = (await response.json()) as MockResponse;

        expect(response.ok).toBe(true);
        expect(data).toEqual(mockResponse);
        expect(requestUrl).toBe(ThorNetworks.TESTNET);
    }, 15000);


    test('ok <- post', async () => {
        const requestBody: TestRequestBody = {
            data: 'test'
        };
        const mockResponse: TestResponse = {
            received: requestBody
        };
        let capturedRequest: Request | undefined;

        const client = new FetchHttpClient(
            toURL(ThorNetworks.TESTNET),
            (request: Request) => {
                capturedRequest = request;
                return request;
            },
            () => createMockResponse(mockResponse)
        );

        const response = await client.post(
            { path: '/test' },
            { query: '' },
            requestBody
        );
        const data = (await response.json()) as TestResponse;

        expect(response.ok).toBe(true);
        expect(data).toEqual(mockResponse);
        expect(capturedRequest?.method).toBe('POST');
        expect(capturedRequest?.url).toBe(ThorNetworks.TESTNET + 'test');
    });

    test('rejects invalid URLs', () => {
        expect(
            () =>
                new FetchHttpClient(
                    new URL('https://invalid.url'),
                    (req) => req,
                    (res) => res
                )
        ).toThrow('Invalid network URL');
    }, 15000);
});
