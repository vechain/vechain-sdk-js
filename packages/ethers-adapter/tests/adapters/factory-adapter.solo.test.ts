import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { ERC20_ABI } from '@vechain/sdk-core';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    type TransactionReceipt,
    type WaitForTransactionOptions
} from '@vechain/sdk-network';
import {
    ContractFactory,
    JsonRpcProvider,
    type Provider,
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
    let mockTransactionReceipt: TransactionReceipt;
    let ethersProvider: Provider;

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

        // Create a mock ethers provider
        ethersProvider = new JsonRpcProvider();

        mockTransactionReceipt = {
            id: '0x123',
            gasUsed: 21000,
            gasPayer: '0x0000000000000000000000000000000000000000',
            paid: '0x0',
            reward: '0x0',
            reverted: false,
            meta: {
                blockID:
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                blockNumber: 0,
                blockTimestamp: 0
            },
            outputs: [
                {
                    contractAddress: '0x456',
                    events: [],
                    transfers: []
                }
            ]
        } as unknown as TransactionReceipt;

        // Mock the fork detector and gas-related methods
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(false));
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('100'));
        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('50'));

        // Mock transaction waiting
        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (_txID: string, _options?: WaitForTransactionOptions) => {
                return await Promise.resolve(mockTransactionReceipt);
            }
        );
    });

    test('Should create a factory adapter and deploy with legacy transaction', async () => {
        const signer = new VoidSigner('0x123', ethersProvider);
        const sendTransactionMock = jest.fn(async (_tx) => {
            return await Promise.resolve({
                hash: '0x123'
            } as unknown as TransactionResponse);
        });

        signer.sendTransaction = sendTransactionMock;
        jest.spyOn(ethersProvider, 'resolveName').mockResolvedValue('0x123');

        const contract = new ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );
        const adapter = factoryAdapter(contract, provider);
        const deployedContract = await adapter.deploy();

        expect(deployedContract).toBeDefined();
        expect(deployedContract.target).toBe('0x456');
        expect(sendTransactionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                gasPriceCoef: 0
            })
        );
    });

    test('Should create a factory adapter and deploy with Galactica transaction', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(true));

        const signer = new VoidSigner('0x123', ethersProvider);
        const sendTransactionMock = jest.fn(async (_tx) => {
            return await Promise.resolve({
                hash: '0x123'
            } as unknown as TransactionResponse);
        });

        signer.sendTransaction = sendTransactionMock;
        jest.spyOn(ethersProvider, 'resolveName').mockResolvedValue('0x123');

        const contract = new ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );
        const adapter = factoryAdapter(contract, provider);
        const deployedContract = await adapter.deploy();

        expect(deployedContract).toBeDefined();
        expect(deployedContract.target).toBe('0x456');
        expect(sendTransactionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                maxFeePerGas: 150n,
                maxPriorityFeePerGas: 50n
            })
        );
    });

    test('Should handle deployment failure when transaction reverts', async () => {
        mockTransactionReceipt.reverted = true;
        mockTransactionReceipt.outputs[0].contractAddress = null;

        const signer = new VoidSigner('0x123', ethersProvider);
        const sendTransactionMock = jest.fn(async (_tx) => {
            return await Promise.resolve({
                hash: '0x123'
            } as unknown as TransactionResponse);
        });

        signer.sendTransaction = sendTransactionMock;
        jest.spyOn(ethersProvider, 'resolveName').mockResolvedValue('0x123');

        const contract = new ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );
        const adapter = factoryAdapter(contract, provider);
        const deployedContract = await adapter.deploy();

        expect(deployedContract).toBeDefined();
        expect(deployedContract.target).toBe('');
    });

    test('Should handle null transaction receipt', async () => {
        provider.thorClient.transactions.waitForTransaction = jest.fn(
            async (_txID: string, _options?: WaitForTransactionOptions) => {
                return await Promise.resolve(null);
            }
        );

        const signer = new VoidSigner('0x123', ethersProvider);
        const sendTransactionMock = jest.fn(async (_tx) => {
            return await Promise.resolve({
                hash: '0x123'
            } as unknown as TransactionResponse);
        });

        signer.sendTransaction = sendTransactionMock;
        jest.spyOn(ethersProvider, 'resolveName').mockResolvedValue('0x123');

        const contract = new ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );
        const adapter = factoryAdapter(contract, provider);
        const deployedContract = await adapter.deploy();

        expect(deployedContract).toBeDefined();
        expect(deployedContract.target).toBe('');
    });

    test('Should handle missing base fee in Galactica fork', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(true));
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve(null));

        const signer = new VoidSigner('0x123', ethersProvider);
        const sendTransactionMock = jest.fn(async (_tx) => {
            return await Promise.resolve({
                hash: '0x123'
            } as unknown as TransactionResponse);
        });

        signer.sendTransaction = sendTransactionMock;
        jest.spyOn(ethersProvider, 'resolveName').mockResolvedValue('0x123');

        const contract = new ContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );
        const adapter = factoryAdapter(contract, provider);

        await expect(adapter.deploy()).rejects.toThrow(
            'Unable to get best block base fee per gas'
        );
    });

    test('Should fail to deploy with a factory adapter without signer', async () => {
        const contract = new ContractFactory(ERC20_ABI, erc20ContractBytecode);
        const adapter = factoryAdapter(contract, provider);

        await expect(async () => await adapter.deploy()).rejects.toThrow(
            'Runner does not support sending transactions'
        );

        expect(adapter).toBeDefined();
    });
});
