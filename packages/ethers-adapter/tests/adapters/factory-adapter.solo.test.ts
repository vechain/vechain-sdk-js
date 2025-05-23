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

    test('Should calculate priority fee based on fee history when rewards are equal', async () => {
        // Mock Galactica fork
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(true));

        // Set base fee to 1000
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('1000'));

        // Mock fee history with equal rewards
        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(
            async () =>
                await Promise.resolve({
                    oldestBlock: '0x0',
                    baseFeePerGas: ['0x1000'],
                    gasUsedRatio: ['0x8000'], // 0.5 as hex string
                    reward: [['0x20', '0x20', '0x20']] // Equal rewards: 25th, 50th, 75th percentiles
                })
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
        await adapter.deploy();

        // Since rewards are equal, it should use the 75th percentile (0x20 = 32)
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(32, 46) = 32
        expect(sendTransactionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                maxPriorityFeePerGas: 32n,
                maxFeePerGas: 1032n // baseFee + maxPriorityFeePerGas
            })
        );
    });

    test('Should calculate priority fee based on average of 75th percentiles', async () => {
        // Mock Galactica fork
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(true));

        // Set base fee to 1000
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('1000'));

        // Mock fee history with varying rewards across blocks
        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(
            async () =>
                await Promise.resolve({
                    oldestBlock: '0x0',
                    baseFeePerGas: ['0x1000', '0x1000'],
                    gasUsedRatio: ['0x8000', '0x8000'], // 0.5 as hex string
                    reward: [
                        ['0x10', '0x20', '0x30'], // Block 1: different percentiles
                        ['0x15', '0x25', '0x35'] // Block 2: different percentiles
                    ]
                })
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
        await adapter.deploy();

        // Average of 75th percentiles: (0x30 + 0x35) / 2 = (48 + 53) / 2 = 50
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(46, 50) = 46
        expect(sendTransactionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                maxPriorityFeePerGas: 46n,
                maxFeePerGas: 1046n // baseFee + maxPriorityFeePerGas
            })
        );
    });

    test('Should fallback to getMaxPriorityFeePerGas when fee history is empty', async () => {
        // Mock Galactica fork
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(true));

        // Set base fee to 1000
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('1000'));

        // Mock empty fee history
        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockImplementation(
            async () =>
                await Promise.resolve({
                    oldestBlock: '0x0',
                    baseFeePerGas: [],
                    gasUsedRatio: [],
                    reward: []
                })
        );

        // Mock fallback priority fee
        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('20'));

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
        await adapter.deploy();

        // Fallback priority fee is 20
        // Compare with baseFeeCap (0.046 * 1000 = 46)
        // Should use min(20, 46) = 20
        expect(sendTransactionMock).toHaveBeenCalledWith(
            expect.objectContaining({
                maxPriorityFeePerGas: 20n,
                maxFeePerGas: 1020n // baseFee + maxPriorityFeePerGas
            })
        );
    });

    test('Should create a factory adapter and deploy with legacy transaction', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(false));

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
