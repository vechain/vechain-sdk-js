"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engineGetPayloadBodiesByHashV1 = void 0;
const sdk_logging_1 = require("@vechain/sdk-logging");
/**
 * RPC Method engine_getPayloadBodiesByHashV1 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineGetPayloadBodiesByHashV1 = async () => {
    // Not implemented yet
    (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
        title: 'engine_getPayloadBodiesByHashV1',
        messages: [
            'Method "engine_getPayloadBodiesByHashV1" has not been implemented yet.'
        ]
    });
    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};
exports.engineGetPayloadBodiesByHashV1 = engineGetPayloadBodiesByHashV1;
