import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    type TransactionReceipt,
    type WaitForTransactionOptions
} from '@vechain/sdk-network';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { helpers } from '../../src';

/**
 *VeChain helpers tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
describe('Helpers tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: HardhatVeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(THOR_SOLO_URL);
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent)
        );
        expect(thorClient).toBeDefined();
    });

    test('Should get the contract address', async () => {
        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (_txID: string, _options?: WaitForTransactionOptions) => {
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                return await Promise.resolve({
                    outputs: [{ contractAddress: 'sampleAddress' }]
                } as TransactionReceipt);
            }
        );
        const address = await helpers.getContractAddress('0x', provider);
        expect(address).toBe('sampleAddress');

        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (_txID: string, _options?: WaitForTransactionOptions) => {
                return await Promise.resolve(null);
            }
        );

        const addressEmpty = await helpers.getContractAddress('0x', provider);
        expect(addressEmpty).toBe('');
    });
});
