import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_feeHistory' method
 *
 * @group integration/rpc-mapper/methods/eth_feeHistory
 */
describe('RPC Mapper - eth_feeHistory method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
    });

    test('Should return empty fee history', async () => {
        const result = await provider.request({
            method: RPC_METHODS.eth_feeHistory,
            params: [4, 'latest', [25, 75]]
        });

        expect(result).toEqual({
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        });
    });
});
