"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Provider
 * @group unit/errors/available-errors/provider
 */
(0, globals_1.describe)('Error package Available errors test - Provider', () => {
    /**
     * JSONRPCParseError
     */
    (0, globals_1.test)('JSONRPCParseError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCParseError('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCInvalidRequest
     */
    (0, globals_1.test)('JSONRPCInvalidRequest', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCInvalidRequest('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCMethodNotFound
     */
    (0, globals_1.test)('JSONRPCMethodNotFound', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCMethodNotFound('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCParseError
     */
    (0, globals_1.test)('JSONRPCInvalidParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCInvalidParams('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCInternalError
     */
    (0, globals_1.test)('JSONRPCInternalError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCInternalError('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCServerError
     */
    (0, globals_1.test)('JSONRPCServerError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCServerError('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCMethodNotImplemented
     */
    (0, globals_1.test)('JSONRPCMethodNotImplemented', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCMethodNotImplemented('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * JSONRPCInvalidDefaultBlock
     */
    (0, globals_1.test)('JSONRPCInvalidDefaultBlock', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.JSONRPCInvalidDefaultBlock('method', 'message', 'invalid block', innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * ProviderMethodError
     */
    (0, globals_1.test)('ProviderMethodError', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.ProviderMethodError('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
