import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { retryOperation } from '../../../../test-utils';

type EthBlock = { hash: string };

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
            const ethGetBlockByNumber = RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ] as (
                params: [blockTag: string, fullTxObjects: boolean]
            ) => Promise<EthBlock>;

            const genesisBlock = await ethGetBlockByNumber(['0x0', true]);

            const blockHash = genesisBlock.hash.slice(2);
            const chainTagByte = blockHash.slice(-2);
            const chaintagId = `0x${chainTagByte}`;

            const rpcCallChainId = (await retryOperation(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_chainId]([])
            )) as string;

            expect(rpcCallChainId).toBe(chaintagId);
        });
    });
});
