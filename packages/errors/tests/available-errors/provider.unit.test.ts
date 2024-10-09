import { describe, expect, test } from '@jest/globals';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    JSONRPCInvalidRequest,
    JSONRPCMethodNotFound,
    JSONRPCParseError,
    JSONRPCServerError,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - Provider
 * @group unit/errors/available-errors/provider
 */
describe('Error package Available errors test - Provider', () => {
    /**
     * JSONRPCParseError
     */
    test('JSONRPCParseError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new JSONRPCParseError(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * JSONRPCInvalidRequest
     */
    test('JSONRPCInvalidRequest', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new JSONRPCInvalidRequest(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * JSONRPCMethodNotFound
     */
    test('JSONRPCMethodNotFound', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new JSONRPCMethodNotFound(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * JSONRPCParseError
     */
    test('JSONRPCInvalidParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new JSONRPCInvalidParams(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * JSONRPCInternalError
     */
    test('JSONRPCInternalError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new JSONRPCInternalError(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * JSONRPCServerError
     */
    test('JSONRPCServerError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new JSONRPCServerError(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
