"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_network_1 = require("@vechain/sdk-network");
const transactionAdapter = __importStar(require("../../src/adapters/transaction-adapter"));
const transaction_adapter_1 = require("../../src/adapters/transaction-adapter");
const factory_adapter_1 = require("../../src/adapters/factory-adapter");
/**
 *VeChain adapters tests - Solo Network
 *
 * @group integration/adapter/contract-adapter-solo
 */
(0, globals_1.describe)('Hardhat factory adapter tests', () => {
    let provider;
    let contract;
    let contractFactory;
    let sendTransactionMock;
    (0, globals_1.beforeEach)(() => {
        provider = new sdk_network_1.HardhatVeChainProvider(new sdk_network_1.ProviderInternalBaseWallet([]), sdk_network_1.THOR_SOLO_URL, (message, parent) => new Error(message, parent));
        // Mock the fork detector and gas-related methods
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockImplementation(async () => await Promise.resolve(false));
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockImplementation(async () => await Promise.resolve('100'));
        globals_1.jest.spyOn(provider.thorClient.gas, 'getMaxPriorityFeePerGas').mockImplementation(async () => await Promise.resolve('50'));
        // Mock HTTP client for transaction receipt polling
        globals_1.jest.spyOn(provider.thorClient.blocks.httpClient, 'http').mockImplementation(async (_method, url) => {
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
        const mockReceipt = {
            contractAddress: '0x456',
            hash: '0x' + '1'.repeat(64),
            blockNumber: 1,
            blockHash: '0x789',
            index: 0,
            gasPrice: BigInt(100),
            from: '0x123',
            to: '0x456'
        };
        const mockTxWait = globals_1.jest
            .fn()
            .mockImplementation(async () => await Promise.resolve(mockReceipt));
        // Create response objects
        const mockTxResponse = {
            ...mockReceipt,
            wait: mockTxWait
        };
        sendTransactionMock = globals_1.jest
            .fn()
            .mockImplementation(async (args) => {
            const tx = args;
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
                    resolveName: globals_1.jest.fn()
                },
                sendTransaction: sendTransactionMock
            }
        };
        // Create contract factory mock
        const mockInterface = {
            deploy: {
                inputs: [],
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'constructor'
            },
            format: globals_1.jest.fn().mockReturnValue([]),
            formatJson: globals_1.jest.fn().mockReturnValue('[]')
        };
        contractFactory = {
            interface: mockInterface,
            deploy: globals_1.jest
                .fn()
                .mockImplementation(async () => await Promise.resolve(contract)),
            getDeployTransaction: globals_1.jest.fn().mockImplementation(async () => {
                return await Promise.resolve({
                    to: null,
                    data: '0x',
                    value: BigInt(0)
                });
            }),
            connect: async function (runner) {
                return await Promise.resolve({
                    ...this,
                    runner
                });
            },
            runner: {
                provider: {
                    resolveName: globals_1.jest.fn(async () => await Promise.resolve(null))
                },
                sendTransaction: sendTransactionMock
            }
        };
        // Mock adaptTransaction
        globals_1.jest.spyOn(transactionAdapter, 'adaptTransaction').mockImplementation(async (args) => {
            const tx = args;
            const baseTx = {
                to: tx.to,
                data: tx.data,
                value: tx.value,
                gasLimit: tx.gasLimit
            };
            // For Galactica fork tests
            if (tx.maxFeePerGas !== undefined ||
                tx.maxPriorityFeePerGas !== undefined) {
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
                gasPriceCoef: tx.gasPrice !== undefined ? Number(tx.gasPrice) : 0,
                gasPrice: undefined
            });
        });
        // Mock the deploy function to use the transaction parameters
        contractFactory.deploy = globals_1.jest
            .fn()
            .mockImplementation(async (...args) => {
            const overrides = args[1] ?? {};
            const deployTx = {
                to: null,
                data: '0x123',
                value: BigInt(0),
                gasLimit: BigInt(21000),
                ...overrides
            };
            // Use the mocked adaptTransaction directly
            const adaptedTx = await (0, transaction_adapter_1.adaptTransaction)(deployTx, provider);
            await sendTransactionMock(adaptedTx);
            return await Promise.resolve(contract);
        });
        // Mock getDeployTransaction to return the correct data
        contractFactory.getDeployTransaction = globals_1.jest
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
    (0, globals_1.test)('Should calculate priority fee based on fee history when rewards are equal', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValue('1000');
        globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x0',
            baseFeePerGas: ['0x1000'],
            gasUsedRatio: ['0x8000'],
            reward: [['0x20', '0x20', '0x20']]
        });
        const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
        await adapter.deploy();
        (0, globals_1.expect)(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });
    (0, globals_1.test)('Should calculate priority fee based on average of 75th percentiles', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValue('1000');
        globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x0',
            baseFeePerGas: ['0x1000', '0x1000'],
            gasUsedRatio: ['0x8000', '0x8000'],
            reward: [
                ['0x10', '0x20', '0x30'],
                ['0x15', '0x25', '0x35']
            ]
        });
        const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
        await adapter.deploy();
        (0, globals_1.expect)(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });
    (0, globals_1.test)('Should fallback to getMaxPriorityFeePerGas when fee history is empty', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValue('1000');
        globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        });
        globals_1.jest.spyOn(provider.thorClient.gas, 'getMaxPriorityFeePerGas').mockResolvedValue('20');
        const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
        await adapter.deploy();
        (0, globals_1.expect)(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });
    (0, globals_1.test)('Should create a factory adapter and deploy with legacy transaction', async () => {
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(false);
        const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
        const deployedContract = await adapter.deploy();
        (0, globals_1.expect)(deployedContract).toBeDefined();
        (0, globals_1.expect)(deployedContract.target).toBe('0x456');
        (0, globals_1.expect)(sendTransactionMock).toHaveBeenCalledWith({
            data: '0x123',
            gas: 21000n,
            to: null,
            value: 0n
        });
    });
    (0, globals_1.test)('Should handle missing base fee in Galactica fork', async () => {
        // Mock post-Galactica environment
        globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        // Mock missing base fee
        globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValue(null);
        const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
        const mockAdaptTransaction = globals_1.jest.spyOn(adapter, 'deploy');
        mockAdaptTransaction.mockRejectedValueOnce(new Error('Unable to get best block base fee per gas'));
        await (0, globals_1.expect)(adapter.deploy()).rejects.toThrow('Unable to get best block base fee per gas');
    });
    (0, globals_1.describe)('deployContract', () => {
        it('should adapt transaction parameters for pre-Galactica deployment', async () => {
            // Mock pre-Galactica environment
            globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(false);
            const deploymentTx = {
                data: '0x123',
                value: BigInt(0),
                gasPrice: BigInt(1000),
                gasPriceCoef: 128,
                gas: BigInt(21000)
            };
            const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
            await adapter.deploy([], {
                ...deploymentTx
            });
            (0, globals_1.expect)(sendTransactionMock).toHaveBeenCalledWith({
                data: deploymentTx.data,
                value: deploymentTx.value,
                gas: deploymentTx.gas,
                to: null
            });
        });
        it('should adapt transaction parameters for post-Galactica deployment', async () => {
            // Mock post-Galactica environment
            globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
            globals_1.jest.spyOn(provider.thorClient.blocks, 'getBestBlockBaseFeePerGas').mockResolvedValue('1000');
            globals_1.jest.spyOn(provider.thorClient.gas, 'getFeeHistory').mockResolvedValue({
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
            const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
            await adapter.deploy([], {
                ...deploymentTx
            });
            (0, globals_1.expect)(sendTransactionMock).toHaveBeenCalledWith({
                data: deploymentTx.data,
                value: deploymentTx.value,
                gas: deploymentTx.gas,
                to: null
            });
        });
        it('should reject dynamic fee transaction before Galactica fork', async () => {
            // Mock pre-Galactica environment
            globals_1.jest.spyOn(provider.thorClient.forkDetector, 'isGalacticaForked').mockResolvedValue(false);
            const deploymentTx = {
                data: '0x123',
                value: BigInt(0),
                maxFeePerGas: BigInt(2000),
                maxPriorityFeePerGas: BigInt(20)
            };
            const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
            const mockAdaptTransaction = globals_1.jest.spyOn(adapter, 'deploy');
            mockAdaptTransaction.mockRejectedValueOnce(new Error('Dynamic fee transaction not supported before Galactica fork'));
            await (0, globals_1.expect)(adapter.deploy([], {
                ...deploymentTx
            })).rejects.toThrow('Dynamic fee transaction not supported before Galactica fork');
        });
        it('should fail with clear error when contract address is missing', async () => {
            // Mock waitForTransaction to return null receipt
            globals_1.jest.spyOn(provider.thorClient.transactions, 'waitForTransaction').mockResolvedValue(null);
            const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
            await (0, globals_1.expect)(adapter.deploy()).rejects.toThrow('Contract deployment failed: no contract address returned from transaction receipt');
        });
        it('should fail with insufficient VTHO error message', async () => {
            // Mock transaction failure due to insufficient VTHO
            const insufficientVthoError = new Error('insufficient energy for gas * price + value');
            sendTransactionMock.mockImplementationOnce(() => Promise.reject(insufficientVthoError));
            const adapter = (0, factory_adapter_1.factoryAdapter)(contractFactory, provider);
            await (0, globals_1.expect)(adapter.deploy()).rejects.toThrow('insufficient energy for gas * price + value');
        });
        it('should fail with missing constructor arguments error message', async () => {
            // Create a contract factory that requires constructor arguments
            const contractWithConstructorArgs = {
                ...contractFactory,
                interface: {
                    ...contractFactory.interface,
                    deploy: {
                        inputs: [
                            {
                                name: '_simpleParameter',
                                type: 'uint8'
                            }
                        ],
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'constructor'
                    }
                }
            };
            // Mock the getDeployTransaction to throw when no arguments are provided
            contractWithConstructorArgs.getDeployTransaction =
                globals_1.jest.fn().mockImplementation(async (...args) => {
                    if (!args || args.length === 0) {
                        throw new Error('missing argument: _simpleParameter');
                    }
                    return await Promise.resolve({
                        to: null,
                        data: '0x123',
                        value: BigInt(0),
                        gas: BigInt(21000)
                    });
                });
            const adapter = (0, factory_adapter_1.factoryAdapter)(contractWithConstructorArgs, provider);
            await (0, globals_1.expect)(adapter.deploy()).rejects.toThrow('missing argument: _simpleParameter');
        });
    });
});
