import { describe, expect, test, jest } from '@jest/globals';
import {
    PostDebugTracerRequest,
    TraceTransactionClause,
    type PostDebugTracerRequestJSON
} from '../../../src/thor/debug';
import { type HttpClient } from '../../../src/http';

/**
 * VeChain trace transaction clause - unit
 *
 * @group unit/debug
 */
describe('TraceTransactionClause unit tests', () => {
    describe('PostDebugTracerRequest', () => {
        test('constructs with all fields', () => {
            const json: PostDebugTracerRequestJSON = {
                name: 'call',
                config: { some: 'config' },
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const request = new PostDebugTracerRequest(json);
            expect(request.name?.toString()).toBe(json.name);
            expect(request.config).toEqual(json.config);
            expect(request.target).toBe(json.target);
        });

        test('constructs with minimal fields', () => {
            const json: PostDebugTracerRequestJSON = {
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const request = new PostDebugTracerRequest(json);
            expect(request.name).toBeUndefined();
            expect(request.config).toBeUndefined();
            expect(request.target).toBe(json.target);
        });

        test('toJSON returns correct format', () => {
            const json: PostDebugTracerRequestJSON = {
                name: 'call',
                config: { some: 'config' },
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const request = new PostDebugTracerRequest(json);
            expect(request.toJSON()).toEqual(json);
        });
    });

    describe('TraceTransactionClause', () => {
        test('static of() creates instance correctly', () => {
            const json: PostDebugTracerRequestJSON = {
                name: 'call',
                config: { some: 'config' },
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const request = TraceTransactionClause.of(json);
            expect(request).toBeInstanceOf(TraceTransactionClause);
            expect(request.request).toBeInstanceOf(PostDebugTracerRequest);
            expect(request.request.toJSON()).toEqual(json);
        });

        test('askTo() processes response correctly', async () => {
            const requestJson: PostDebugTracerRequestJSON = {
                name: 'call',
                config: { some: 'config' },
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const mockResponse = {
                gas: 21000,
                failed: false,
                returnValue: '0x',
                structLogs: []
            };

            const mockHttpClient = {
                post: jest.fn(async () => {
                    return await Promise.resolve({
                        json: async () => await Promise.resolve(mockResponse)
                    });
                }),
                get: jest.fn(async () => {
                    return await Promise.resolve({
                        json: async () => await Promise.resolve({})
                    });
                })
            } as unknown as HttpClient;

            const request = TraceTransactionClause.of(requestJson);
            const result = await request.askTo(mockHttpClient);

            expect(mockHttpClient.post).toHaveBeenCalledWith(
                TraceTransactionClause.PATH,
                { query: '' },
                requestJson
            );

            expect(result.request).toBe(request);
            expect(result.response).toEqual(mockResponse);
        });

        test('askTo() handles error response', async () => {
            const requestJson: PostDebugTracerRequestJSON = {
                name: 'call',
                target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
            };

            const mockHttpClient = {
                post: jest.fn(async () => {
                    return await Promise.reject(new Error('Network error'));
                }),
                get: jest.fn(async () => {
                    return await Promise.resolve({
                        json: async () => await Promise.resolve({})
                    });
                })
            } as unknown as HttpClient;

            const request = TraceTransactionClause.of(requestJson);
            await expect(request.askTo(mockHttpClient)).rejects.toThrow(
                'Network error'
            );
        });
    });
});
