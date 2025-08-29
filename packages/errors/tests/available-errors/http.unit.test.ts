import { describe, expect, test } from '@jest/globals';
import {
    InvalidHTTPRequest,
    InvalidHTTPParams,
    HttpNetworkError,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - HTTP
 * @group unit/errors/available-errors/http
 */
describe('Error package Available errors test - HTTP', () => {
    /**
     * InvalidHTTPRequest
     */
    test('InvalidHTTPRequest', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidHTTPRequest(
                    'method',
                    'message',
                    {
                        method: 'method',
                        url: 'url'
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidHTTPParams
     */
    test('InvalidHTTPParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidHTTPParams(
                    'method',
                    'message',
                    {
                        method: 'method',
                        url: 'url'
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * HttpNetworkError
     */
    test('HttpNetworkError', () => {
        // Inner error
        [undefined, new Error('network error')].forEach((innerError) => {
            expect(() => {
                throw new HttpNetworkError(
                    'method',
                    'message',
                    {
                        method: 'method',
                        url: 'url',
                        networkErrorType: 'NetworkError'
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
