import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    MAINNET_URL,
    ThorClient
} from '../../../../../src';
import { mainNetwork } from '../../../../fixture';

/**
 * RPC Mapper integration tests for 'eth_chainId' method
 *
 * @group integration/rpc-mapper/methods/eth_chainId-mainnet
 */
describe('RPC Mapper - eth_chainId method tests mainnet', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(mainNetwork);
    });

    /**
     * eth_chainId RPC call tests - Positive cases
     */
    describe('eth_chainId - Positive cases', () => {
        /**
         * Test case regarding obtaining the chain id
         */
        test('Should return the chain id', async () => {
            // derive expected chainId dynamically from genesis block last byte
            const genesisBlock: any = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x0', true]);

            const blockHashBytes = genesisBlock.hash.slice(2);
            const lastByte = blockHashBytes.slice(-2);
            const expectedChainId = `0x${lastByte}`;

            const rpcCallChainId = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_chainId
            ]([])) as string;

            expect(rpcCallChainId).toBe(expectedChainId);
        });
    });
});
