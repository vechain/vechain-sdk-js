import { jest } from '@jest/globals';
import { type FetchHttpClient } from '@http';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post',
    ok: boolean = true,
    status: number = 200
): FetchHttpClient => {
    return {
        [httpMethod]: jest.fn().mockImplementation(async () => {
            return await Promise.resolve({
                ok,
                status,
                statusText: ok ? 'OK' : 'Bad Request',
                url: 'https://mock-url',
                json: async () => await Promise.resolve(response satisfies T),
                text: async () =>
                    await Promise.resolve(JSON.stringify(response))
            });
        })
    } as unknown as FetchHttpClient;
};

const mockHttpClientWithError = (
    error: string,
    httpMethod: 'get' | 'post'
): FetchHttpClient => {
    return {
        [httpMethod]: jest.fn(
            async () =>
                await Promise.resolve(
                    new Response(fastJsonStableStringify(error), {
                        status: 400
                    })
                )
        )
    } as unknown as FetchHttpClient;
};

export { mockHttpClient, mockHttpClientWithError };
