import { type FetchHttpClient } from '../../src';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post'
): FetchHttpClient => {
    return {
        [httpMethod]: jest.fn().mockImplementation(() => {
            return {
                json: jest.fn().mockImplementation(() => {
                    return response satisfies T;
                })
            };
        })
    } as unknown as FetchHttpClient;
};

export { mockHttpClient };
