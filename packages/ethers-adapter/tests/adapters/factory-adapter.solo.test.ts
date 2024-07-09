import { HardhatVeChainProvider } from '@vechain/sdk-network';
import {
    ProviderInternalBaseWallet,
    ThorClient,
    type WaitForTransactionOptions
} from '@vechain/sdk-network';
import { erc20ContractBytecode, soloUrl } from '../fixture';
import { factoryAdapter } from '../../src';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ERC20_ABI, vechain_sdk_core_ethers } from '@vechain/sdk-core';

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
        thorClient = ThorClient.fromUrl(soloUrl);
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            soloUrl,
            (message: string, parent?: Error) => new Error(message, parent)
        );
        expect(thorClient).toBeDefined();

        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (
                _txID: string,
                _options?: WaitForTransactionOptions | undefined
            ) => {
                return await Promise.resolve(null);
            }
        );
    });

    test('Should create a factory adapter and deploy', async () => {
        const signer: vechain_sdk_core_ethers.Signer =
            new vechain_sdk_core_ethers.VoidSigner('0x');

        signer.sendTransaction = jest.fn(async (_tx) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return await ({} as unknown as Promise<vechain_sdk_core_ethers.TransactionResponse>);
        });

        signer.resolveName = jest.fn(async (_name: string) => {
            return await Promise.resolve('mock');
        });

        const contract = new vechain_sdk_core_ethers.ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        // Create a contract adapter
        const adapter = factoryAdapter(contract, provider);

        expect(await adapter.deploy()).toBeDefined();
    });

    test('Should fail to deploy with a factory adapter', async () => {
        const contract = new vechain_sdk_core_ethers.ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode
        );

        // Create a contract adapter
        const adapter = factoryAdapter(contract, provider);

        await expect(async () => await adapter.deploy()).rejects.toThrowError();

        expect(adapter).toBeDefined();
    });
});
