import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    CHAIN_ID,
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';

const soloChainId =
    '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6';

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
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
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

            expect(rpcCallChainId).toBe(soloChainId);
        });
    });
});
