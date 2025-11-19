"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parityNextNonce = void 0;
const sdk_logging_1 = require("@vechain/sdk-logging");
/**
 * RPC Method parity_nextNonce implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const parityNextNonce = async () => {
    // Not implemented yet
    (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
        title: 'parity_nextNonce',
        messages: ['Method "parity_nextNonce" has not been implemented yet.']
    });
    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};
exports.parityNextNonce = parityNextNonce;
