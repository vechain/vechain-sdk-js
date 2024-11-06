import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

/**
 * RPC Mapper integration tests for 'engine_exchangeCapabilities' method
 *
 * @group integration/rpc-mapper/methods/engine_exchangeCapabilities
 */
describe('RPC Mapper - engine_exchangeCapabilities method tests', () => {
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
     * engine_exchangeCapabilities RPC call tests - Positive cases
     */
    describe('engine_exchangeCapabilities - Positive cases', () => {
        /**
         * Positive case 1 - ... Description ...
         */
        test('engine_exchangeCapabilities - positive case 1', async () => {
            const logSpy = jest.spyOn(VeChainSDKLogger('warning'), 'log');

            // NOT IMPLEMENTED YET!
            await RPCMethodsMap(thorClient)[
                RPC_METHODS.engine_exchangeCapabilities
            ]([-1]);

            expect(logSpy).toHaveBeenCalled();
            logSpy.mockRestore();
        });
    });
});
