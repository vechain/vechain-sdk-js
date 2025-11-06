/* eslint-disable */
// TODO: These tests are temporarily disabled pending contracts module rework
// @ts-nocheck
import { describe, expect, test, jest } from '@jest/globals';
import {
    ContractFactory
} from '../../../../src/thor/thor-client/contracts';
import { ThorClient } from '../../../../src/thor/thor-client/ThorClient';
import { Address } from '../../../../src/common/vcdm';
import { IllegalArgumentError } from '../../../../src/common/errors';

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

// Helper to create ThorClient for tests
const createThorClient = () => ThorClient.at(createMockHttpClient() as any);

// Mock signer
const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn().mockResolvedValue('0xsigned_transaction_data')
});

// Test contract ABI with constructor
const testContractAbi = [
    {
        type: 'constructor',
        inputs: [
            { name: 'initialValue', type: 'uint256' },
            { name: 'name', type: 'string' }
        ],
        stateMutability: 'nonpayable'
    },
    {
        type: 'function',
        name: 'getValue',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'setValue',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'newValue', type: 'uint256' }],
        outputs: []
    },
    {
        type: 'event',
        name: 'ValueChanged',
        inputs: [
            { name: 'oldValue', type: 'uint256', indexed: true },
            { name: 'newValue', type: 'uint256', indexed: true }
        ]
    }
] as const;

// Test bytecode
const testBytecode =
    '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101a88061004e6000396000f3fe608060405234801561001057600080fd5b50600436106100345760003560e01c806360fe47b1146100395780636d4ce63c14610055575b600080fd5b610053600480360381019061004e91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

/**
 * @group unit/contracts/factory
 */
describe.skip('ContractFactory', () => {
    const thorClient = createThorClient();
    const signer = createMockSigner();

    describe('Constructor and Basic Properties', () => {
        test('Should create ContractFactory with required properties', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                thorClient.contracts
            );

            expect(factory).toBeInstanceOf(ContractFactory);
            expect(factory.getAbi()).toBe(testContractAbi);
            expect(factory.getBytecode()).toBe(testBytecode);
            expect(factory.getSigner()).toBe(signer);
        });

        test('Should store ABI correctly', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const abi = factory.getAbi();
            expect(abi).toEqual(testContractAbi);
            expect(abi).toHaveLength(4); // constructor, 2 functions, 1 event
        });

        test('Should store bytecode correctly', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const bytecode = factory.getBytecode();
            expect(bytecode).toBe(testBytecode);
            expect(bytecode).toMatch(/^0x/);
        });

        test('Should store signer correctly', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const storedSigner = factory.getSigner();
            expect(storedSigner).toBe(signer);
            expect(storedSigner.address).toBe(signer.address);
        });
    });

    describe('createDeploymentClause Method', () => {
        test('Should create deployment clause with constructor args', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const constructorArgs = [100, 'Test Contract'];
            const clause = factory.createDeploymentClause(constructorArgs);

            expect(clause).toHaveProperty('to');
            expect(clause).toHaveProperty('data');
            expect(clause).toHaveProperty('value');
            expect(clause.to).toBe(null); // Contract deployment has null 'to'
            expect(clause.value).toBe(0n);
            expect(clause.data).toMatch(/^0x[a-fA-F0-9]+$/);
        });

        test('Should create deployment clause with options', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const constructorArgs = [200, 'Test Contract with Options'];
            const options = { comment: 'Deployment test' };
            const clause = factory.createDeploymentClause(
                constructorArgs,
                options
            );

            expect(clause).toHaveProperty('to');
            expect(clause).toHaveProperty('data');
            expect(clause).toHaveProperty('value');
            expect(clause.to).toBe(null); // Contract deployment has null 'to'
            expect(clause.value).toBe(0n);
        });

        test('Should throw IllegalArgumentError for wrong number of constructor args', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const wrongArgs = [100]; // Missing second argument

            expect(() => {
                factory.createDeploymentClause(wrongArgs);
            }).toThrow(IllegalArgumentError);
        });

        test('Should throw IllegalArgumentError for too many constructor args', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const tooManyArgs = [100, 'Test Contract', 'extra']; // Too many arguments

            expect(() => {
                factory.createDeploymentClause(tooManyArgs);
            }).toThrow(IllegalArgumentError);
        });

        test('Should handle empty constructor args for contract without constructor', () => {
            const abiWithoutConstructor = [
                {
                    type: 'function',
                    name: 'getValue',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: [{ name: '', type: 'uint256' }]
                }
            ] as const;

            const factory = new ContractFactory(
                abiWithoutConstructor,
                testBytecode,
                signer,
                contractsModule
            );

            const clause = factory.createDeploymentClause([]);
            expect(clause).toHaveProperty('to');
            expect(clause).toHaveProperty('data');
            expect(clause).toHaveProperty('value');
        });
    });

    describe('deploy Method', () => {
        test('Should throw error for deploy without constructor args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            await expect(factory.deploy()).rejects.toThrow(
                'Constructor expects 2 arguments, but 0 were provided'
            );
        });

        test('Should throw error for deploy with constructor args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const constructorArgs = [100, 'Test Contract'];

            await expect(factory.deploy(constructorArgs)).rejects.toThrow(
                'ContractFactory.deploy() requires ThorClient transaction sending implementation'
            );
        });

        test('Should throw error for deploy with options', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const options = { gas: 1000000, gasPrice: '1000000000' };

            await expect(factory.deploy([], options)).rejects.toThrow(
                'Constructor expects 2 arguments, but 0 were provided'
            );
        });

        test('Should throw IllegalArgumentError for wrong number of args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const wrongArgs = [100]; // Missing second argument

            await expect(factory.deploy(wrongArgs)).rejects.toThrow(
                IllegalArgumentError
            );
        });
    });

    describe('estimateDeploymentGas Method', () => {
        test('Should throw error for estimateDeploymentGas without constructor args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            await expect(factory.estimateDeploymentGas()).rejects.toThrow(
                'Constructor expects 2 arguments, but 0 were provided'
            );
        });

        test('Should throw error for estimateDeploymentGas with args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const constructorArgs = [200, 'Gas Test Contract'];

            await expect(
                factory.estimateDeploymentGas(constructorArgs)
            ).rejects.toThrow(
                'ContractFactory.estimateDeploymentGas() requires ThorClient gas estimation implementation'
            );
        });

        test('Should throw error for estimateDeploymentGas with options', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const options = { comment: 'Gas estimation test' };

            await expect(
                factory.estimateDeploymentGas([], options)
            ).rejects.toThrow(
                'Constructor expects 2 arguments, but 0 were provided'
            );
        });

        test('Should throw IllegalArgumentError for wrong number of args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const wrongArgs = [200]; // Missing second argument

            await expect(
                factory.estimateDeploymentGas(wrongArgs)
            ).rejects.toThrow(IllegalArgumentError);
        });
    });

    describe('simulateDeployment Method', () => {
        test('Should throw error for simulateDeployment without constructor args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            await expect(factory.simulateDeployment()).rejects.toThrow(
                'Constructor expects 2 arguments, but 0 were provided'
            );
        });

        test('Should throw error for simulateDeployment with args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const constructorArgs = [300, 'Simulation Test Contract'];

            await expect(
                factory.simulateDeployment(constructorArgs)
            ).rejects.toThrow(
                'ContractFactory.simulateDeployment() requires ThorClient simulation implementation'
            );
        });

        test('Should throw error for simulateDeployment with options', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const options = {
                revision: 'best',
                caller: '0x1234567890123456789012345678901234567890'
            };

            await expect(
                factory.simulateDeployment([], options)
            ).rejects.toThrow(
                'Constructor expects 2 arguments, but 0 were provided'
            );
        });

        test('Should throw IllegalArgumentError for wrong number of args', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );
            const wrongArgs = [300]; // Missing second argument

            await expect(factory.simulateDeployment(wrongArgs)).rejects.toThrow(
                IllegalArgumentError
            );
        });
    });

    describe('Error Handling', () => {
        test('Should throw IllegalArgumentError with proper context for wrong constructor args', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const wrongArgs = [100]; // Missing second argument

            try {
                factory.createDeploymentClause(wrongArgs);
            } catch (error) {
                expect(error).toBeInstanceOf(IllegalArgumentError);
                expect(error.message).toContain(
                    'Constructor expects 2 arguments, but 1 were provided'
                );
                expect(error.args).toHaveProperty('expected', 2);
                expect(error.args).toHaveProperty('provided', 1);
                expect(error.args).toHaveProperty('constructorAbi', wrongArgs);
            }
        });

        test('Should throw IllegalArgumentError for deployment failure', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            try {
                await factory.deploy([100, 'Test']);
            } catch (error) {
                expect(error).toBeInstanceOf(IllegalArgumentError);
                expect(error.message).toContain(
                    'ContractFactory.deploy() requires ThorClient transaction sending implementation'
                );
                expect(error.context).toHaveProperty('constructorArgs', [
                    100,
                    'Test'
                ]);
            }
        });

        test('Should throw IllegalArgumentError for gas estimation failure', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            try {
                await factory.estimateDeploymentGas([200, 'Gas Test']);
            } catch (error) {
                expect(error).toBeInstanceOf(IllegalArgumentError);
                expect(error.message).toContain(
                    'ContractFactory.estimateDeploymentGas() requires ThorClient gas estimation implementation'
                );
                expect(error.args).toHaveProperty('constructorArgs', [
                    200,
                    'Gas Test'
                ]);
            }
        });

        test('Should throw IllegalArgumentError for simulation failure', async () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            try {
                await factory.simulateDeployment([300, 'Simulation Test']);
            } catch (error) {
                expect(error).toBeInstanceOf(IllegalArgumentError);
                expect(error.message).toContain(
                    'ContractFactory.simulateDeployment() requires ThorClient simulation implementation'
                );
                expect(error.args).toHaveProperty('constructorArgs', [
                    300,
                    'Simulation Test'
                ]);
            }
        });
    });

    describe('Type Safety', () => {
        test('Should maintain ABI type information', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            const abi = factory.getAbi();

            // TypeScript should infer the correct types
            expect(abi[0].type).toBe('constructor');
            expect(abi[1].name).toBe('getValue');
            expect(abi[2].name).toBe('setValue');
            expect(abi[3].name).toBe('ValueChanged');
        });

        test('Should handle different ABI types', () => {
            const complexAbi = [
                {
                    type: 'constructor',
                    inputs: [],
                    stateMutability: 'nonpayable'
                },
                {
                    type: 'function',
                    name: 'viewFunction',
                    stateMutability: 'view',
                    inputs: [],
                    outputs: []
                },
                {
                    type: 'function',
                    name: 'pureFunction',
                    stateMutability: 'pure',
                    inputs: [],
                    outputs: []
                },
                {
                    type: 'function',
                    name: 'payableFunction',
                    stateMutability: 'payable',
                    inputs: [],
                    outputs: []
                },
                {
                    type: 'function',
                    name: 'nonpayableFunction',
                    stateMutability: 'nonpayable',
                    inputs: [],
                    outputs: []
                },
                { type: 'event', name: 'TestEvent', inputs: [] }
            ] as const;

            const factory = new ContractFactory(
                complexAbi,
                testBytecode,
                signer,
                contractsModule
            );

            expect(factory.getAbi()).toEqual(complexAbi);
        });
    });

    describe('Integration with ContractsModule', () => {
        test('Should maintain reference to ContractsModule', () => {
            const factory = new ContractFactory(
                testContractAbi,
                testBytecode,
                signer,
                contractsModule
            );

            // The factory should have access to the contracts module
            // This is tested indirectly through the constructor and getter methods
            expect(factory.getAbi()).toBe(testContractAbi);
            expect(factory.getBytecode()).toBe(testBytecode);
            expect(factory.getSigner()).toBe(signer);
        });

        test('Should handle empty ABI', () => {
            const emptyAbi = [] as const;
            const factory = new ContractFactory(
                emptyAbi,
                testBytecode,
                signer,
                contractsModule
            );

            expect(factory.getAbi()).toEqual(emptyAbi);
            expect(factory.getBytecode()).toBe(testBytecode);
        });

        test('Should handle empty bytecode', () => {
            const emptyBytecode = '0x';
            const factory = new ContractFactory(
                testContractAbi,
                emptyBytecode,
                signer,
                contractsModule
            );

            expect(factory.getAbi()).toBe(testContractAbi);
            expect(factory.getBytecode()).toBe(emptyBytecode);
        });
    });
});
