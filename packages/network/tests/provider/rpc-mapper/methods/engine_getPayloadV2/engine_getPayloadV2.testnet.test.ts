import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Mapper integration tests for 'engine_getPayloadV2' method
 *
 * @group integration/rpc-mapper/methods/engine_getPayloadV2
 */
describe('RPC Mapper - engine_getPayloadV2 method tests', () => {
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
     * engine_getPayloadV1 RPC call tests - Positive cases
     */
    describe('engine_getPayloadV2 - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('engine_getPayloadV2 - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[RPC_METHODS.engine_getPayloadV2]([
                -1
            ]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
