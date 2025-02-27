import { type HttpClient } from '../../src';

const mockHttpClient = <T>(
    response: T,
    httpMethod: 'get' | 'post'
): HttpClient => {
    return {
        [httpMethod]: () => {
            return {
                json: () => {
                    return response satisfies T;
                }
            };
        }
    } as unknown as HttpClient;
};

export { mockHttpClient };
