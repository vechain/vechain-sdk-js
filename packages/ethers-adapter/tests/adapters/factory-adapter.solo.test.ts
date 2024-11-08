import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ERC20_ABI } from '@vechain/sdk-core';
import { UnsupportedOperation } from '@vechain/sdk-errors';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    type WaitForTransactionOptions
} from '@vechain/sdk-network';
import {
    ContractFactory,
    type Signer,
    type TransactionResponse,
    VoidSigner
} from 'ethers';
import { factoryAdapter } from '../../src';
import { erc20ContractBytecode } from '../fixture';

/**
 *VeChain adapters tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
describe('Hardhat factory adapter tests', () => {
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

        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (_txID: string, _options?: WaitForTransactionOptions) => {
                return await Promise.resolve(null);
            }
        );
    });

    test('Should create a factory adapter and deploy', async () => {
        const signer: Signer = new VoidSigner('0x');

        signer.sendTransaction = jest.fn(async (_tx) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return await ({} as unknown as Promise<TransactionResponse>);
        });

        signer.resolveName = jest.fn(async (_name: string) => {
            return await Promise.resolve('mock');
        });

        const contract = new ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        // Create a contract adapter
        const adapter = factoryAdapter(contract, provider);

        expect(await adapter.deploy()).toBeDefined();
    });

    test('Should fail to deploy with a factory adapter', async () => {
        const contract = new ContractFactory(ERC20_ABI, erc20ContractBytecode);

        // Create a contract adapter
        const adapter = factoryAdapter(contract, provider);

        await expect(async () => await adapter.deploy()).rejects.toThrowError(
            UnsupportedOperation
        );

        expect(adapter).toBeDefined();
    });
});
