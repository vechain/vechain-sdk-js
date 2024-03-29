/**
 * Vechain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
import { HardhatVechainProvider } from '@vechain/sdk-provider';
import { ThorClient } from '@vechain/sdk-network';
import { soloNetwork, soloUrl } from '../fixture';
import { BaseWallet } from '@vechain/sdk-wallet';
import { contractAdapter } from '../../src';
import { describe, expect, test } from '@jest/globals';
import { vechain_sdk_core_ethers } from '@vechain/sdk-core';

/**
 * Vechain adapters tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
describe('Hardhat provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: HardhatVechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(soloNetwork);
        provider = new HardhatVechainProvider(
            new BaseWallet([]),
            soloUrl,
            (message: string, parent?: Error) => new Error(message, parent)
        );
        expect(thorClient).toBeDefined();
    });

    test('Should be to create a contract adapter', () => {
        const contract = new vechain_sdk_core_ethers.Contract('0x', []);
        // Create a contract adapter
        const adapter = contractAdapter(contract, provider);
        expect(adapter).toBeDefined();
    });
});
