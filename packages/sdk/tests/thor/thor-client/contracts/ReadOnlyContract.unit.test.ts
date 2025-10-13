import { describe, expect, test, jest } from '@jest/globals';
import {
    Contract,
    ContractsModule
} from '../../../../src/thor/thor-client/contracts';
import { Address } from '../../../../src/common/vcdm';

// Mock HttpClient
const createMockHttpClient = () => ({
    get: jest.fn(),
    post: jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
            clauses: [
                {
                    reverted: false,
                    data: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    gasUsed: 21000,
                    vmError: null
                }
            ]
        }),
        text: jest
            .fn()
            .mockResolvedValue(
                '{"clauses":[{"reverted":false,"data":"0x0000000000000000000000000000000000000000000000000000000000000000","gasUsed":21000,"vmError":null}]}'
            )
    }),
    put: jest.fn(),
    delete: jest.fn()
});

// Mock signer
const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn()
});

// Read-only contract ABI (only view and pure functions)
const readOnlyContractAbi = [
    {
        type: 'function',
        name: 'getBalance',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'getTotalSupply',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'isValidAddress',
        stateMutability: 'pure',
        inputs: [{ name: 'addr', type: 'address' }],
        outputs: [{ name: '', type: 'bool' }]
    },
    {
        type: 'function',
        name: 'calculateHash',
        stateMutability: 'pure',
        inputs: [{ name: 'data', type: 'bytes32' }],
        outputs: [{ name: '', type: 'bytes32' }]
    },
    {
        type: 'function',
        name: 'getContractInfo',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'decimals', type: 'uint8' }
        ]
    },
    {
        type: 'function',
        name: 'getMultipleBalances',
        stateMutability: 'view',
        inputs: [{ name: 'accounts', type: 'address[]' }],
        outputs: [{ name: 'balances', type: 'uint256[]' }]
    }
] as const;

/**
 * @group unit/contracts/read-only
 */
describe('Read-Only Contract', () => {
    const contractAddress = Address.of(
        '0x1234567890123456789012345678901234567890'
    );

    describe('Constructor and Basic Properties', () => {
        test('Should create read-only contract instance', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const signer = createMockSigner();

            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule,
                signer
            );

            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(readOnlyContractAbi);
            expect(contract.contractsModule).toBe(contractsModule);
            expect(contract.getSigner()).toBe(signer);
        });

        test('Should create read-only contract without signer', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);

            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            expect(contract.getSigner()).toBeUndefined();
        });
    });

    describe('Read Methods Initialization', () => {
        test('Should initialize read methods for view functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // View functions should have read methods
            expect(contract.read).toHaveProperty('getBalance');
            expect(contract.read).toHaveProperty('getTotalSupply');
            expect(contract.read).toHaveProperty('getContractInfo');
            expect(contract.read).toHaveProperty('getMultipleBalances');

            expect(typeof contract.read.getBalance).toBe('function');
            expect(typeof contract.read.getTotalSupply).toBe('function');
            expect(typeof contract.read.getContractInfo).toBe('function');
            expect(typeof contract.read.getMultipleBalances).toBe('function');
        });

        test('Should initialize read methods for pure functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // Pure functions should have read methods
            expect(contract.read).toHaveProperty('isValidAddress');
            expect(contract.read).toHaveProperty('calculateHash');

            expect(typeof contract.read.isValidAddress).toBe('function');
            expect(typeof contract.read.calculateHash).toBe('function');
        });

        test('Should NOT initialize transact methods for read-only contract', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // No transact methods should exist for read-only contract
            expect(Object.keys(contract.transact)).toHaveLength(0);
        });
    });

    describe('Read Method Execution', () => {
        test('Should execute view function with single parameter', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const testAddress = '0x1234567890123456789012345678901234567890';
            const result = await contract.read.getBalance(testAddress);

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should execute view function without parameters', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const result = await contract.read.getTotalSupply();

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should execute pure function with address parameter', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const testAddress = '0x1234567890123456789012345678901234567890';
            const result = await contract.read.isValidAddress(testAddress);

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should execute pure function with bytes32 parameter', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const testData =
                '0x1234567890123456789012345678901234567890123456789012345678901234';
            const result = await contract.read.calculateHash(testData);

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should execute view function with multiple return values', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const result = await contract.read.getContractInfo();

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should execute view function with array parameter', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const testAddresses = [
                '0x1234567890123456789012345678901234567890',
                '0x9876543210987654321098765432109876543210'
            ];
            const result =
                await contract.read.getMultipleBalances(testAddresses);

            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('Clause Building for Read Functions', () => {
        test('Should build clause for view function', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const testAddress = '0x1234567890123456789012345678901234567890';
            const clause = contract.clause.getBalance(testAddress);

            expect(clause).toEqual({
                to: contractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/),
                value: 0n,
                comment: undefined
            });
        });

        test('Should build clause for pure function', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const testAddress = '0x1234567890123456789012345678901234567890';
            const clause = contract.clause.isValidAddress(testAddress);

            expect(clause).toEqual({
                to: contractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/),
                value: 0n,
                comment: undefined
            });
        });

        test('Should build clause for function without parameters', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const clause = contract.clause.getTotalSupply();

            expect(clause).toEqual({
                to: contractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/),
                value: 0n,
                comment: undefined
            });
        });
    });

    describe('Contract Options for Read Operations', () => {
        test('Should set and get read options', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const readOptions = {
                revision: 'best',
                caller: '0x1234567890123456789012345678901234567890'
            };
            const result = contract.setContractReadOptions(readOptions);

            expect(result).toEqual(readOptions);
            expect(contract.getContractReadOptions()).toEqual(readOptions);
        });

        test('Should clear read options', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            contract.setContractReadOptions({ revision: 'best' });
            contract.clearContractReadOptions();

            expect(contract.getContractReadOptions()).toEqual({});
        });

        test('Should use read options in method calls', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            const readOptions = {
                revision: '0x123',
                caller: '0x9876543210987654321098765432109876543210'
            };
            contract.setContractReadOptions(readOptions);

            const result = await contract.read.getTotalSupply();

            expect(Array.isArray(result)).toBe(true);
            expect(contract.getContractReadOptions()).toEqual(readOptions);
        });
    });

    describe('Error Handling for Read Operations', () => {
        test('Should handle invalid function calls gracefully', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // This should not throw an error, but return empty array or handle gracefully
            const result = await contract.read.getBalance('invalid_address');

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should handle missing signer for read operations', async () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // Read operations should work without signer
            expect(contract.getSigner()).toBeUndefined();

            const result = await contract.read.getTotalSupply();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('VeChain SDK Integration for Read Operations', () => {
        test('Should work with ContractsModule for read operations', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            expect(contract.contractsModule).toBe(contractsModule);
            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(readOnlyContractAbi);
        });

        test('Should maintain reference to signer for read operations', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const signer = createMockSigner();
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule,
                signer
            );

            expect(contract.getSigner()).toBe(signer);
        });
    });

    describe('Read-Only Contract Specific Features', () => {
        test('Should not have any transact methods', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // Verify no transact methods exist
            const transactKeys = Object.keys(contract.transact);
            expect(transactKeys).toHaveLength(0);
        });

        test('Should have all read methods for all functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // All functions in read-only contract should have read methods
            const expectedReadMethods = [
                'getBalance',
                'getTotalSupply',
                'isValidAddress',
                'calculateHash',
                'getContractInfo',
                'getMultipleBalances'
            ];

            expectedReadMethods.forEach((methodName) => {
                expect(contract.read).toHaveProperty(methodName);
                expect(typeof contract.read[methodName]).toBe('function');
            });
        });

        test('Should have clause methods for all functions', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contract = new Contract(
                contractAddress,
                readOnlyContractAbi,
                contractsModule
            );

            // All functions should have clause methods
            const expectedClauseMethods = [
                'getBalance',
                'getTotalSupply',
                'isValidAddress',
                'calculateHash',
                'getContractInfo',
                'getMultipleBalances'
            ];

            expectedClauseMethods.forEach((methodName) => {
                expect(contract.clause).toHaveProperty(methodName);
                expect(typeof contract.clause[methodName]).toBe('function');
            });
        });
    });
});
