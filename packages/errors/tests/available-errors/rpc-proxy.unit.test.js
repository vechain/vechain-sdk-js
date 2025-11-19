"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - RPC Proxy
 * @group unit/errors/available-errors/rpc-proxy
 */
(0, globals_1.describe)('Error package Available errors test - RPC Proxy', () => {
    /**
     * InvalidCommandLineArguments
     */
    (0, globals_1.test)('InvalidCommandLineArguments', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidCommandLineArguments('method', 'message', { flag: 'flag1', value: 'value1' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidConfigurationFilePath
     */
    (0, globals_1.test)('InvalidConfigurationFilePath', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidConfigurationFilePath('method', 'message', { filePath: 'path' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidConfigurationFile
     */
    (0, globals_1.test)('InvalidConfigurationFile', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidConfigurationFile('method', 'message', {
                    filePath: 'path',
                    wrongField: 'field',
                    message: 'Some message'
                }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    (0, globals_1.test)('JSONRPCTransactionRevertError', () => {
        (0, globals_1.expect)(() => {
            throw new src_1.JSONRPCTransactionRevertError('message', 'data');
        }).toThrowError(Error);
        (0, globals_1.expect)(() => {
            throw new src_1.JSONRPCTransactionRevertError(undefined, undefined);
        }).toThrowError(Error);
    });
});
