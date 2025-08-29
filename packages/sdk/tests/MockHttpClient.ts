import { jest } from '@jest/globals';
import { type HttpClient } from '@common';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post',
    ok: boolean = true,
    status: number = 200
): HttpClient => {
    return {
        [httpMethod]: jest.fn().mockImplementation(async () => {
            // noinspection ES6RedundantAwait
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
    } as unknown as HttpClient;
};

const mockHttpClientWithError = (
    error: string,
    httpMethod: 'get' | 'post'
): HttpClient => {
    // noinspection ES6RedundantAwait
    return {
        [httpMethod]: jest.fn(
            async () =>
                await Promise.resolve(
                    new Response(fastJsonStableStringify(error), {
                        status: 400
                    })
                )
        )
    } as unknown as HttpClient;
};

export { mockHttpClient, mockHttpClientWithError };
