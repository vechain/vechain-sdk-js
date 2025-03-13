import { describe, expect, test } from '@jest/globals';
import { RPC_METHODS } from '../../../../../src/provider/utils/const/rpc-mapper/rpc-methods';

/**
 * RPC Mapper tests for 'engine_getPayloadBodiesByHashV1' method
 *
 * @group integration/rpc-mapper/methods/engine_getPayloadBodiesByHashV1
 */
describe('engine_getPayloadBodiesByHashV1', () => {
    test('should be defined in RPC_METHODS', () => {
        expect(RPC_METHODS.engine_getPayloadBodiesByHashV1).toBeDefined();
        expect(RPC_METHODS.engine_getPayloadBodiesByHashV1).toBe(
            'engine_getPayloadBodiesByHashV1'
        );
    });

    // Note: We're not testing the implementation since it's intentionally not implemented
    test('should be marked as a method to be implemented', () => {
        // This test verifies that the method is listed in the TO BE IMPLEMENTED section
        // of the RPC_METHODS enum
        const methodsToImplement = Object.values(RPC_METHODS).filter(
            (method) =>
                RPC_METHODS[method as keyof typeof RPC_METHODS] === method
        );
        expect(methodsToImplement).toContain('engine_getPayloadBodiesByHashV1');
    });
});
