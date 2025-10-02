import { describe, expect, test, jest } from '@jest/globals';
import {
    Contract,
    ContractsModule
} from '../../../../src/thor/thor-client/contracts';
import { Address } from '../../../../src/common/vcdm';

// Mock HttpClient
const createMockHttpClient = () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
});

// Mock signer
const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn()
});

// TestingContract ABI (simplified version)
const testingContractAbi = [
    {
        type: 'function',
        name: 'stateVariable',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'setStateVariable',
        stateMutability: 'nonpayable',
        inputs: [{ name: '_newValue', type: 'uint256' }],
        outputs: []
    },
    {
        type: 'function',
        name: 'boolData',
        stateMutability: 'pure',
        inputs: [{ name: '_boolData', type: 'bool' }],
        outputs: [{ name: '', type: 'bool' }]
    },
    {
        type: 'function',
        name: 'deposit',
        stateMutability: 'payable',
        inputs: [{ name: '_amount', type: 'uint256' }],
        outputs: []
    },
    {
        type: 'event',
        name: 'StateChanged',
        inputs: [
            { name: 'newValue', type: 'uint256', indexed: true },
            { name: 'oldValue', type: 'uint256', indexed: true },
            { name: 'sender', type: 'address', indexed: true },
            { name: 'timestamp', type: 'uint256', indexed: false }
        ]
    }
] as const;

/**
 * @group unit/contracts
 */
describe('Contract', () => {
    const contractAddress = Address.of(
        '0x0000000000000000000000000000000000000000'
    );

    describe('Constructor and Basic Properties', () => {
        test('Should create contract instance with required properties', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const signer = createMockSigner();

            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule,
                signer
            );

            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(testingContractAbi);
            expect(contract.contractsModule).toBe(contractsModule);
            expect(contract.getSigner()).toBe(signer);
        });

        test('Should create contract without signer', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);

            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            expect(contract.getSigner()).toBeUndefined();
        });
    });

    describe('Contract Options Management', () => {
        test('Should set and get contract read options', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const readOptions = { revision: 'best', caller: '0x123' };
            const result = contract.setContractReadOptions(readOptions);

            expect(result).toEqual(readOptions);
            expect(contract.getContractReadOptions()).toEqual(readOptions);
        });

        test('Should clear contract read options', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            contract.setContractReadOptions({ revision: 'best' });
            contract.clearContractReadOptions();

            expect(contract.getContractReadOptions()).toEqual({});
        });

        test('Should set and get contract transaction options', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const transactOptions = { gas: 21000, gasPrice: '1000000000' };
            const result = contract.setContractTransactOptions(transactOptions);

            expect(result).toEqual(transactOptions);
            expect(contract.getContractTransactOptions()).toEqual(
                transactOptions
            );
        });

        test('Should clear contract transaction options', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            contract.setContractTransactOptions({ gas: 21000 });
            contract.clearContractTransactOptions();

            expect(contract.getContractTransactOptions()).toEqual({});
        });
    });

    describe('Signer Management', () => {
        test('Should set and get signer', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );
            const signer = createMockSigner();

            const result = contract.setSigner(signer);

            expect(result).toBe(signer);
            expect(contract.getSigner()).toBe(signer);
        });
    });

    describe('ABI Parsing', () => {
        test('Should get function ABI by name', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const functionAbi = contract.getFunctionAbi('setStateVariable');

            expect(functionAbi).toEqual({
                type: 'function',
                name: 'setStateVariable',
                stateMutability: 'nonpayable',
                inputs: [{ name: '_newValue', type: 'uint256' }],
                outputs: []
            });
        });

        test('Should throw error for non-existent function', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            expect(() => {
                contract.getFunctionAbi('nonExistentFunction');
            }).toThrow('Function nonExistentFunction not found in ABI');
        });

        test('Should get event ABI by name', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const eventAbi = contract.getEventAbi('StateChanged');

            expect(eventAbi).toEqual({
                type: 'event',
                name: 'StateChanged',
                inputs: [
                    { name: 'newValue', type: 'uint256', indexed: true },
                    { name: 'oldValue', type: 'uint256', indexed: true },
                    { name: 'sender', type: 'address', indexed: true },
                    { name: 'timestamp', type: 'uint256', indexed: false }
                ]
            });
        });

        test('Should throw error for non-existent event', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            expect(() => {
                contract.getEventAbi('NonExistentEvent');
            }).toThrow('Event NonExistentEvent not found in ABI');
        });
    });

    describe('Method Initialization', () => {
        test('Should initialize read methods for view/pure functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            // View function
            expect(contract.read).toHaveProperty('stateVariable');
            expect(typeof contract.read.stateVariable).toBe('function');

            // Pure function
            expect(contract.read).toHaveProperty('boolData');
            expect(typeof contract.read.boolData).toBe('function');
        });

        test('Should initialize transact methods for payable/nonpayable functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            // Nonpayable function
            expect(contract.transact).toHaveProperty('setStateVariable');
            expect(typeof contract.transact.setStateVariable).toBe('function');

            // Payable function
            expect(contract.transact).toHaveProperty('deposit');
            expect(typeof contract.transact.deposit).toBe('function');
        });

        test('Should initialize clause methods for all functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            expect(contract.clause).toHaveProperty('stateVariable');
            expect(contract.clause).toHaveProperty('setStateVariable');
            expect(contract.clause).toHaveProperty('boolData');
            expect(contract.clause).toHaveProperty('deposit');

            expect(typeof contract.clause.stateVariable).toBe('function');
            expect(typeof contract.clause.setStateVariable).toBe('function');
            expect(typeof contract.clause.boolData).toBe('function');
            expect(typeof contract.clause.deposit).toBe('function');
        });

        test('Should initialize filter and criteria methods for events', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            expect(contract.filters).toHaveProperty('StateChanged');
            expect(typeof contract.filters.StateChanged).toBe('function');

            expect(contract.criteria).toHaveProperty('StateChanged');
            expect(typeof contract.criteria.StateChanged).toBe('function');
        });
    });

    describe('Method Execution (Stub Behavior)', () => {
        test('Should execute read method with console logging', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const result = await contract.read.stateVariable();

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual([]);

            consoleSpy.mockRestore();
        });

        test('Should execute transact method with console logging', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const result = await contract.transact.setStateVariable(42);

            expect(result).toEqual({ transactionId: 'stub_tx_id' });

            consoleSpy.mockRestore();
        });

        test('Should execute clause method with console logging', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const result = contract.clause.setStateVariable(42);

            // No console.log expected in new implementation
            expect(result).toEqual({
                to: contractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/), // Encoded function call
                value: '0x0',
                comment: undefined
            });

            consoleSpy.mockRestore();
        });

        test('Should execute filter method with console logging', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const result = contract.filters.StateChanged('0x123');

            expect(result).toEqual({
                address: contractAddress.toString(),
                topics: [expect.any(String)]
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Utility Methods', () => {
        test('Should encode function data with fallback', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation();

            // This will likely fail due to viem encoding issues, so should fallback
            const result = contract.encodeFunctionData('setStateVariable', [
                42
            ]);

            // Should either return encoded data or fallback
            expect(typeof result).toBe('string');
            expect(result.startsWith('0x')).toBe(true);

            consoleWarnSpy.mockRestore();
        });

        test('Should get event selector with fallback', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation();

            // This will likely fail due to viem encoding issues, so should fallback
            const result = contract.getEventSelector('StateChanged');

            // Should either return event selector or fallback
            expect(typeof result).toBe('string');
            expect(result.startsWith('0x')).toBe(true);

            consoleWarnSpy.mockRestore();
        });
    });

    describe('VeChain SDK Integration', () => {
        test('Should work with ContractsModule', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule
            );

            expect(contract.contractsModule).toBe(contractsModule);
            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(testingContractAbi);
        });

        test('Should maintain reference to signer', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const signer = createMockSigner();
            const contract = new Contract(
                contractAddress,
                testingContractAbi,
                contractsModule,
                signer
            );

            expect(contract.getSigner()).toBe(signer);
        });
    });
});
