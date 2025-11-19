"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.engineGetPayloadBodiesByRangeV1 = void 0;
const sdk_logging_1 = require("@vechain/sdk-logging");
/**
 * RPC Method engine_getPayloadBodiesByRangeV1 implementation
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const engineGetPayloadBodiesByRangeV1 = async () => {
    // Not implemented yet
    (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
        title: 'engine_getPayloadBodiesByRangeV1',
        messages: [
            'Method "engine_getPayloadBodiesByRangeV1" has not been implemented yet.'
        ]
    });
    // To avoid eslint error
    return await Promise.resolve('METHOD NOT IMPLEMENTED');
};
exports.engineGetPayloadBodiesByRangeV1 = engineGetPayloadBodiesByRangeV1;
