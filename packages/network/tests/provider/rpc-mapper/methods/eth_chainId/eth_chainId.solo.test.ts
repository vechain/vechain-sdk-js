import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { retryOperation } from '../../../../test-utils';
let dynamicChainId: string;

/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId-solo
 */
describe('RPC Mapper - eth_chainId method tests solo', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(async () => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
        const genesis = await retryOperation(
            async () => await thorClient.blocks.getBlockCompressed(0)
        );
        const genesisHash = genesis?.id ?? '0x00';
        dynamicChainId = `0x${genesisHash.slice(-2)}`;
    });

    /**
     * eth_chainId RPC call tests - Positive cases
     */
    describe('eth_chainId - Positive cases', () => {
        /**
         * Test case regarding obtaining the chain id
         */
        test('Should return the chain id', async () => {
            const rpcCallChainId = (await retryOperation(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_chainId]([])
            )) as string;

            expect(rpcCallChainId).toBe(dynamicChainId);
        });
    });
});
