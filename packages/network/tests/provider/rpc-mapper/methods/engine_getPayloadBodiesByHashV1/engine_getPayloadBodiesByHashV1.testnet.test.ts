import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Mapper integration tests for 'engine_getPayloadBodiesByHashV1' method
 *
 * @group integration/rpc-mapper/methods/engine_getPayloadBodiesByHashV1
 */
describe('RPC Mapper - engine_getPayloadBodiesByHashV1 method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * engine_getPayloadBodiesByHashV1 RPC call tests - Positive cases
     */
    describe('engine_getPayloadBodiesByHashV1 - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('engine_getPayloadBodiesByHashV1 - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[
                RPC_METHODS.engine_getPayloadBodiesByHashV1
            ]([-1]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
