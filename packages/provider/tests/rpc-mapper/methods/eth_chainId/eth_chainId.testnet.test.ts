import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { networkInfo } from '@vechain/vechain-sdk-core';

/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId
 */
describe('RPC Mapper - eth_chainId method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Inti thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Destory thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_chainId RPC call tests - Positive cases
     */
    describe('eth_chainId - Positive cases', () => {
        /**
         * Test case regarding obtaining the chain id
         */
        test('Should return the chain id', async () => {
            const rpcCallChainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            expect(rpcCallChainId).toBe(networkInfo.testnet.genesisBlock.id);
        });
    });
});
