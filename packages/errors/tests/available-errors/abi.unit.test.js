"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - ABI
 * @group unit/errors/available-errors/abi
 */
(0, globals_1.describe)('Error package Available errors test - ABI', () => {
    /**
     * Helper function to test InvalidAbiDataToEncodeOrDecode
     */
    const testInvalidAbiDataToEncodeOrDecode = (innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.InvalidAbiDataToEncodeOrDecode('method', 'message', { data: 'data' }, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test InvalidAbiDataToEncodeOrDecode
     */
    (0, globals_1.test)('InvalidAbiDataToEncodeOrDecode', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testInvalidAbiDataToEncodeOrDecode(innerError);
        });
    });
    /**
     * Helper function to test InvalidAbiItem
     */
    const testInvalidAbiItem = (data, innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.InvalidAbiItem('method', 'message', data, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test InvalidAbiItem
     */
    (0, globals_1.test)('InvalidAbiItem', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            const abiItems = [
                { type: 'function', value: 'abiItem' }, // Correctly typed
                { type: 'event', value: 'abiItem' } // Correctly typed
            ];
            abiItems.forEach((data) => {
                testInvalidAbiItem(data, innerError);
            });
        });
    });
    /**
     * Helper function to test InvalidAbiSignatureFormat
     */
    const testInvalidAbiSignatureFormat = (innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.InvalidAbiSignatureFormat('method', 'message', { signatureFormat: 'signatureFormat' }, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test InvalidAbiSignatureFormat
     */
    (0, globals_1.test)('InvalidAbiSignatureFormat', () => {
        [undefined, new Error('error')].forEach((innerError) => {
            testInvalidAbiSignatureFormat(innerError);
        });
    });
});
