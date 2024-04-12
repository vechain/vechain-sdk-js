import { HardhatVechainProvider } from '@vechain/sdk-provider';
import {
    ThorClient,
    type TransactionReceipt,
    type WaitForTransactionOptions
} from '@vechain/sdk-network';
import { soloNetwork, soloUrl } from '../fixture';
import { BaseWallet } from '@vechain/sdk-wallet';
import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { helpers } from '../../src/adapters/helpers';

/**
 * Vechain helpers tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
describe('Helpers tests', () => {
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

    test('Should get the contract address', async () => {
        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (
                _txID: string,
                _options?: WaitForTransactionOptions | undefined
            ) => {
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                return await Promise.resolve({
                    outputs: [{ contractAddress: 'sampleAddress' }]
                } as TransactionReceipt);
            }
        );
        const address = await helpers.getContractAddress('0x', provider);
        expect(address).toBe('sampleAddress');

        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (
                _txID: string,
                _options?: WaitForTransactionOptions | undefined
            ) => {
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                return await Promise.resolve(null);
            }
        );

        const addressEmpty = await helpers.getContractAddress('0x', provider);
        expect(addressEmpty).toBe('');
    });
});
