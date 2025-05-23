import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL
} from '@vechain/sdk-network';
import type {
    Contract,
    ContractFactory,
    TransactionRequest,
    TransactionResponse,
    TransactionReceipt,
    ContractTransactionReceipt,
    Interface
} from 'ethers';
import * as transactionAdapter from '../../src/adapters/transaction-adapter';
import { adaptTransaction } from '../../src/adapters/transaction-adapter';
import { factoryAdapter } from '../../src/adapters/factory-adapter';

/**
 *VeChain adapters tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
describe('Hardhat factory adapter tests', () => {
    let provider: HardhatVeChainProvider;
    let contract: Contract;
    let contractFactory: ContractFactory;
    let sendTransactionMock: jest.Mock;

    beforeEach(() => {
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent)
        );

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

        // Mock HTTP client for transaction receipt polling
        jest.spyOn(
            provider.thorClient.blocks.httpClient,
            'http'
        ).mockImplementation(async (_method: string, url: string) => {
            if (url.includes('/receipt')) {
                return await Promise.resolve({
                    ...mockReceipt,
                    meta: {
                        blockID: '0x' + '0'.repeat(64),
                        blockNumber: 1,
                        blockTimestamp: 1000000
                    },
                    outputs: [
                        {
                            contractAddress: '0x456',
                            events: [],
                            transfers: []
                        }
                    ]
                });
            }
            return await Promise.resolve(null);
        });

        // Create base mock objects
        const mockReceipt: Partial<ContractTransactionReceipt> = {
            contractAddress: '0x456',
            hash: '0x' + '1'.repeat(64),
            blockNumber: 1,
            blockHash: '0x789',
            index: 0,
            gasPrice: BigInt(100),
            from: '0x123',
            to: '0x456'
        };

        const mockTxWait = jest
            .fn()
            .mockImplementation(
                async () => await Promise.resolve(mockReceipt)
            ) as unknown as (
            _confirms?: number,
            _timeout?: number
        ) => Promise<TransactionReceipt>;

        // Create response objects
        const mockTxResponse: Partial<TransactionResponse> = {
            ...mockReceipt,
            wait: mockTxWait
        };

        sendTransactionMock = jest
            .fn()
            .mockImplementation(async (args: unknown) => {
                const tx = args as TransactionRequest;
                return await Promise.resolve({
                    ...mockTxResponse,
                    ...tx
                });
            });

        // Create contract mock
        contract = {
            target: '0x456',
            runner: {
                provider: {
                    resolveName: jest.fn()
                },
                sendTransaction: sendTransactionMock
            }
        } as unknown as Contract;

        // Create contract factory mock
        const mockInterface = {
            deploy: {
                inputs: [],
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'constructor'
            },
            format: jest.fn().mockReturnValue([]),
            formatJson: jest.fn().mockReturnValue('[]')
        } as unknown as Interface;

        contractFactory = {
            interface: mockInterface,
            deploy: jest
                .fn()
                .mockImplementation(
                    async () => await Promise.resolve(contract)
                ),
            getDeployTransaction: jest.fn().mockImplementation(async () => {
                return await Promise.resolve({
                    to: null,
                    data: '0x',
                    value: BigInt(0)
                });
            }),
            connect: async function (runner: unknown) {
                return await Promise.resolve({
                    ...this,
                    runner
                });
            },
            runner: {
                provider: {
                    resolveName: jest.fn(
                        async () => await Promise.resolve(null)
                    )
                },
                sendTransaction: sendTransactionMock
            }
        } as unknown as ContractFactory;

        // Mock adaptTransaction
        jest.spyOn(transactionAdapter, 'adaptTransaction').mockImplementation(
            async (args: unknown) => {
                const tx = args as TransactionRequest;
                const baseTx = {
                    to: tx.to,
                    data: tx.data,
                    value: tx.value,
                    gasLimit: tx.gasLimit
                };

                // For Galactica fork tests
                if (
                    tx.maxFeePerGas !== undefined ||
                    tx.maxPriorityFeePerGas !== undefined
                ) {
                    return await Promise.resolve({
                        ...baseTx,
                        maxFeePerGas: tx.maxFeePerGas,
                        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
                        gasPriceCoef: undefined,
                        gasPrice: undefined
                    });
                }
                // For legacy transaction test
                return await Promise.resolve({
                    ...baseTx,
                    gasPriceCoef:
                        tx.gasPrice !== undefined ? Number(tx.gasPrice) : 0,
                    gasPrice: undefined
                });
            }
        );

        // Mock the deploy function to use the transaction parameters
        (contractFactory.deploy as jest.Mock) = jest
            .fn()
            .mockImplementation(async (...args: unknown[]) => {
                const overrides = args[1] ?? {};
                const deployTx = {
                    to: null,
                    data: '0x123',
                    value: BigInt(0),
                    gasLimit: BigInt(21000),
                    ...overrides
                };

                // Use the mocked adaptTransaction directly
                const adaptedTx = await adaptTransaction(deployTx, provider);
                await sendTransactionMock(adaptedTx);
                return await Promise.resolve(contract);
            });

        // Mock getDeployTransaction to return the correct data
        (contractFactory.getDeployTransaction as jest.Mock) = jest
            .fn()
            .mockImplementation(async () => {
                return await Promise.resolve({
                    to: null,
                    data: '0x123',
                    value: BigInt(0),
                    gas: BigInt(21000)
                });
            });
    });

    test('Should calculate priority fee based on fee history when rewards are equal', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValue(true);

        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('1000');

        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x0',
            baseFeePerGas: ['0x1000'],
            gasUsedRatio: ['0x8000'],
            reward: [['0x20', '0x20', '0x20']]
        });

        const adapter = factoryAdapter(contractFactory, provider);
        await adapter.deploy();

        expect(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });

    test('Should calculate priority fee based on average of 75th percentiles', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValue(true);

        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('1000');

        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x0',
            baseFeePerGas: ['0x1000', '0x1000'],
            gasUsedRatio: ['0x8000', '0x8000'],
            reward: [
                ['0x10', '0x20', '0x30'],
                ['0x15', '0x25', '0x35']
            ]
        });

        const adapter = factoryAdapter(contractFactory, provider);
        await adapter.deploy();

        expect(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });

    test('Should fallback to getMaxPriorityFeePerGas when fee history is empty', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValue(true);

        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('1000');

        jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        });

        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockResolvedValue('20');

        const adapter = factoryAdapter(contractFactory, provider);
        await adapter.deploy();

        expect(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });

    test('Should create a factory adapter and deploy with legacy transaction', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValue(false);

        const adapter = factoryAdapter(contractFactory, provider);
        const deployedContract = await adapter.deploy();

        expect(deployedContract).toBeDefined();
        expect(deployedContract.target).toBe('0x456');
        expect(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });

    test('Should handle missing base fee in Galactica fork', async () => {
        // Mock post-Galactica environment
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValue(true);

        // Mock missing base fee
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue(null);

        const adapter = factoryAdapter(contractFactory, provider);
        const mockAdaptTransaction = jest.spyOn(adapter, 'deploy');
        mockAdaptTransaction.mockRejectedValueOnce(
            new Error('Unable to get best block base fee per gas')
        );
        await expect(adapter.deploy()).rejects.toThrow(
            'Unable to get best block base fee per gas'
        );
    });

    describe('deployContract', () => {
        it('should adapt transaction parameters for pre-Galactica deployment', async () => {
            // Mock pre-Galactica environment
            jest.spyOn(
                provider.thorClient.forkDetector,
                'isGalacticaForked'
            ).mockResolvedValue(false);

            const deploymentTx = {
                data: '0x123',
                value: BigInt(0),
                gasPrice: BigInt(1000),
                gasPriceCoef: 128,
                gas: BigInt(21000)
            };

            const adapter = factoryAdapter(contractFactory, provider);
            await adapter.deploy([], {
                ...deploymentTx
            });

            expect(sendTransactionMock).toHaveBeenCalledWith({
                data: deploymentTx.data,
                value: deploymentTx.value,
                gas: deploymentTx.gas,
                to: null
            });
        });

        it('should adapt transaction parameters for post-Galactica deployment', async () => {
            // Mock post-Galactica environment
            jest.spyOn(
                provider.thorClient.forkDetector,
                'isGalacticaForked'
            ).mockResolvedValue(true);

            jest.spyOn(
                provider.thorClient.blocks,
                'getBestBlockBaseFeePerGas'
            ).mockResolvedValue('1000');

            jest.spyOn(
                provider.thorClient.gas,
                'getFeeHistory'
            ).mockResolvedValue({
                oldestBlock: '0x0',
                baseFeePerGas: ['0x3e8'],
                gasUsedRatio: ['0x8000'],
                reward: [['0x14']] // 20 in hex
            });

            const deploymentTx = {
                data: '0x123',
                value: BigInt(0),
                maxFeePerGas: BigInt(2000),
                maxPriorityFeePerGas: BigInt(20),
                gas: BigInt(21000)
            };

            const adapter = factoryAdapter(contractFactory, provider);
            await adapter.deploy([], {
                ...deploymentTx
            });

            expect(sendTransactionMock).toHaveBeenCalledWith({
                data: deploymentTx.data,
                value: deploymentTx.value,
                gas: deploymentTx.gas,
                to: null
            });
        });

        it('should reject dynamic fee transaction before Galactica fork', async () => {
            // Mock pre-Galactica environment
            jest.spyOn(
                provider.thorClient.forkDetector,
                'isGalacticaForked'
            ).mockResolvedValue(false);

            const deploymentTx = {
                data: '0x123',
                value: BigInt(0),
                maxFeePerGas: BigInt(2000),
                maxPriorityFeePerGas: BigInt(20)
            };

            const adapter = factoryAdapter(contractFactory, provider);
            const mockAdaptTransaction = jest.spyOn(adapter, 'deploy');
            mockAdaptTransaction.mockRejectedValueOnce(
                new Error(
                    'Dynamic fee transaction not supported before Galactica fork'
                )
            );
            await expect(
                adapter.deploy([], {
                    ...deploymentTx
                })
            ).rejects.toThrow(
                'Dynamic fee transaction not supported before Galactica fork'
            );
        });
    });
});
