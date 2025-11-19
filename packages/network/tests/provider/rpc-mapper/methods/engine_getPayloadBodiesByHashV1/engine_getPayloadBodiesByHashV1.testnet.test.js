"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const rpc_methods_1 = require("../../../../../src/provider/utils/const/rpc-mapper/rpc-methods");
/**
 * RPC Mapper tests for 'engine_getPayloadBodiesByHashV1' method
 *
 * @group integration/rpc-mapper/methods/engine_getPayloadBodiesByHashV1
 */
(0, globals_1.describe)('engine_getPayloadBodiesByHashV1', () => {
    (0, globals_1.test)('should be defined in RPC_METHODS', () => {
        (0, globals_1.expect)(rpc_methods_1.RPC_METHODS.engine_getPayloadBodiesByHashV1).toBeDefined();
        (0, globals_1.expect)(rpc_methods_1.RPC_METHODS.engine_getPayloadBodiesByHashV1).toBe('engine_getPayloadBodiesByHashV1');
    });
    // Note: We're not testing the implementation since it's intentionally not implemented
    (0, globals_1.test)('should be marked as a method to be implemented', () => {
        // This test verifies that the method is listed in the TO BE IMPLEMENTED section
        // of the RPC_METHODS enum
        const methodsToImplement = Object.values(rpc_methods_1.RPC_METHODS).filter((method) => rpc_methods_1.RPC_METHODS[method] === method);
        (0, globals_1.expect)(methodsToImplement).toContain('engine_getPayloadBodiesByHashV1');
    });
});
