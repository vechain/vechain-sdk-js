"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - HTTP
 * @group unit/errors/available-errors/http
 */
(0, globals_1.describe)('Error package Available errors test - HTTP', () => {
    /**
     * InvalidHTTPRequest
     */
    (0, globals_1.test)('InvalidHTTPRequest', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidHTTPRequest('method', 'message', {
                    method: 'method',
                    url: 'url'
                }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidHTTPParams
     */
    (0, globals_1.test)('InvalidHTTPParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidHTTPParams('method', 'message', {
                    method: 'method',
                    url: 'url'
                }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * HttpNetworkError
     */
    (0, globals_1.test)('HttpNetworkError', () => {
        // Inner error
        [undefined, new Error('network error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.HttpNetworkError('method', 'message', {
                    method: 'method',
                    url: 'url',
                    networkErrorType: 'NetworkError'
                }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
