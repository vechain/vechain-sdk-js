import { jest } from '@jest/globals';
import { type FetchHttpClient } from '../../src';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post'
): FetchHttpClient => {
    return {
        [httpMethod]: jest.fn().mockImplementation(async () => {
            return await Promise.resolve({
                json: async () => await Promise.resolve(response satisfies T)
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
            async () => await Promise.reject(new Error(error))
        )
    } as unknown as FetchHttpClient;
};

export { mockHttpClient, mockHttpClientWithError };
