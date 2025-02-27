import { type HttpClient } from '../../src';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post'
): HttpClient => {
    return {
        [httpMethod]: jest.fn().mockImplementation(() => {
            return {
                json: jest.fn().mockImplementation(() => {
                    return response satisfies T;
                })
            };
        })
    } as unknown as HttpClient;
};

export { mockHttpClient };
