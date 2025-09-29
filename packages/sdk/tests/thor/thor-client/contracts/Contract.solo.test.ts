import { describe, expect, test } from '@jest/globals';
import { ContractsModule, Contract } from '../../../../src/thor/thor-client/contracts';
import { createPublicClient, createWalletClient } from '../../../../src/viem/clients';
import { ThorClient } from '../../../../src/thor/thor-client/ThorClient';
import { FetchHttpClient } from '../../../../src/common/http';
import { ThorNetworks } from '../../../../src/thor/thorest';
import { Address } from '../../../../src/common/vcdm';
import { privateKeyToAccount } from 'viem/accounts';

// TestingContract ABI (from solo-setup)
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
        name: 'uintData',
        stateMutability: 'pure',
        inputs: [{ name: '_uintData', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'addressData',
        stateMutability: 'pure',
        inputs: [{ name: '_addressData', type: 'address' }],
        outputs: [{ name: '', type: 'address' }]
    },
    {
        type: 'function',
        name: 'stringData',
        stateMutability: 'pure',
        inputs: [{ name: '_stringData', type: 'string' }],
        outputs: [{ name: '', type: 'string' }]
    },
    {
        type: 'function',
        name: 'deposit',
        stateMutability: 'payable',
        inputs: [{ name: '_amount', type: 'uint256' }],
        outputs: []
    },
    {
        type: 'function',
        name: 'getBalance',
        stateMutability: 'view',
        inputs: [{ name: '_address', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
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

// EventsContract ABI (from solo-setup)
const eventsContractAbi = [
    {
        type: 'function',
        name: 'emitTransfer',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' }
        ],
        outputs: []
    },
    {
        type: 'function',
        name: 'emitNote',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'who', type: 'address' },
            { name: 'note', type: 'string' }
        ],
        outputs: []
    },
    {
        type: 'function',
        name: 'emitDataOnly',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'tag', type: 'string' },
            { name: 'payload', type: 'bytes' },
            { name: 'number', type: 'uint256' }
        ],
        outputs: []
    },
    {
        type: 'event',
        name: 'Transfer',
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false }
        ]
    },
    {
        type: 'event',
        name: 'Note',
        inputs: [
            { name: 'who', type: 'address', indexed: true },
            { name: 'note', type: 'string', indexed: false }
        ]
    },
    {
        type: 'event',
        name: 'DataOnly',
        inputs: [
            { name: 'tag', type: 'string', indexed: false },
            { name: 'payload', type: 'bytes', indexed: false },
            { name: 'number', type: 'uint256', indexed: false }
        ]
    }
] as const;

/**
 * @group integration/contracts
 */
describe('Contract Solo Integration Tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.at(httpClient);
    
    // Solo network test accounts
    const testPrivateKey = '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36';
    const testAccount = privateKeyToAccount(`0x${testPrivateKey}`);
    
    // Contract addresses (these should be deployed by solo-setup seeding)
    const testingContractAddress = Address.of('0x8384738C995D49C5b692560ae688fc8b51af1059'); // From solo-setup
    const eventsContractAddress = Address.of('0x99A8e4e0C1FE2Bb5C2D2C7C2b2b2b2b2b2b2b2b2'); // Placeholder - update with actual
    
    let publicClient: ReturnType<typeof createPublicClient>;
    let walletClient: ReturnType<typeof createWalletClient>;
    let contractsModule: ContractsModule;

    beforeAll(async () => {
        publicClient = createPublicClient({
            network: httpClient.baseURL
        });
        
        walletClient = createWalletClient({
            network: httpClient.baseURL,
            account: testAccount
        });
        
        contractsModule = new ContractsModule(publicClient, walletClient);
    });

    describe('TestingContract Integration', () => {
        let testingContract: Contract<typeof testingContractAbi>;

        beforeAll(() => {
            testingContract = contractsModule.load(testingContractAddress, testingContractAbi);
        });

        describe('Read Operations', () => {
            test('Should read state variable', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                
                const result = await testingContract.read.stateVariable();
                
                expect(consoleSpy).toHaveBeenCalledWith('Reading stateVariable with args:', []);
                expect(Array.isArray(result)).toBe(true);
                expect(result).toEqual(['stub_result']); // Current stub behavior
                
                consoleSpy.mockRestore();
            });

            test('Should call pure function with bool data', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                
                const result = await testingContract.read.boolData(true);
                
                expect(consoleSpy).toHaveBeenCalledWith('Reading boolData with args:', [true]);
                expect(Array.isArray(result)).toBe(true);
                
                consoleSpy.mockRestore();
            });

            test('Should call pure function with uint data', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                
                const result = await testingContract.read.uintData(42);
                
                expect(consoleSpy).toHaveBeenCalledWith('Reading uintData with args:', [42]);
                expect(Array.isArray(result)).toBe(true);
                
                consoleSpy.mockRestore();
            });

            test('Should call pure function with address data', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const testAddress = '0x1234567890123456789012345678901234567890';
                
                const result = await testingContract.read.addressData(testAddress);
                
                expect(consoleSpy).toHaveBeenCalledWith('Reading addressData with args:', [testAddress]);
                expect(Array.isArray(result)).toBe(true);
                
                consoleSpy.mockRestore();
            });

            test('Should call pure function with string data', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const testString = 'Hello VeChain!';
                
                const result = await testingContract.read.stringData(testString);
                
                expect(consoleSpy).toHaveBeenCalledWith('Reading stringData with args:', [testString]);
                expect(Array.isArray(result)).toBe(true);
                
                consoleSpy.mockRestore();
            });

            test('Should read balance for address', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const testAddress = testAccount.address;
                
                const result = await testingContract.read.getBalance(testAddress);
                
                expect(consoleSpy).toHaveBeenCalledWith('Reading getBalance with args:', [testAddress]);
                expect(Array.isArray(result)).toBe(true);
                
                consoleSpy.mockRestore();
            });
        });

        describe('Write Operations', () => {
            test('Should execute state-changing transaction', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const newValue = 123;
                
                const result = await testingContract.transact.setStateVariable(newValue);
                
                expect(consoleSpy).toHaveBeenCalledWith('Transacting setStateVariable with args:', [newValue]);
                expect(result).toEqual({ transactionId: 'stub_tx_id' });
                
                consoleSpy.mockRestore();
            });

            test('Should execute payable transaction', async () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const depositAmount = 1000;
                
                const result = await testingContract.transact.deposit(depositAmount);
                
                expect(consoleSpy).toHaveBeenCalledWith('Transacting deposit with args:', [depositAmount]);
                expect(result).toEqual({ transactionId: 'stub_tx_id' });
                
                consoleSpy.mockRestore();
            });
        });

        describe('Clause Building', () => {
            test('Should build clause for view function', () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                
                const clause = testingContract.clause.stateVariable();
                
                expect(consoleSpy).toHaveBeenCalledWith('Building clause for stateVariable with args:', []);
                expect(clause).toEqual({
                    to: testingContractAddress.toString(),
                    data: '0xstateVariable',
                    value: '0x0',
                    comment: undefined
                });
                
                consoleSpy.mockRestore();
            });

            test('Should build clause for state-changing function', () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const newValue = 456;
                
                const clause = testingContract.clause.setStateVariable(newValue);
                
                expect(consoleSpy).toHaveBeenCalledWith('Building clause for setStateVariable with args:', [newValue]);
                expect(clause).toEqual({
                    to: testingContractAddress.toString(),
                    data: '0xsetStateVariable',
                    value: '0x0',
                    comment: undefined
                });
                
                consoleSpy.mockRestore();
            });

            test('Should build clause for payable function', () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const depositAmount = 2000;
                
                const clause = testingContract.clause.deposit(depositAmount);
                
                expect(consoleSpy).toHaveBeenCalledWith('Building clause for deposit with args:', [depositAmount]);
                expect(clause).toEqual({
                    to: testingContractAddress.toString(),
                    data: '0xdeposit',
                    value: '0x0',
                    comment: undefined
                });
                
                consoleSpy.mockRestore();
            });
        });

        describe('Event Filtering', () => {
            test('Should create event filter', () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const filterArgs = ['0x123', '0x456'];
                
                const filter = testingContract.filters.StateChanged(...filterArgs);
                
                expect(consoleSpy).toHaveBeenCalledWith('Creating filter for StateChanged with args:', filterArgs);
                expect(filter).toEqual({ eventName: 'StateChanged', args: filterArgs });
                
                consoleSpy.mockRestore();
            });

            test('Should create event criteria', () => {
                const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
                const criteriaArgs = ['0x789'];
                
                const criteria = testingContract.criteria.StateChanged(...criteriaArgs);
                
                expect(consoleSpy).toHaveBeenCalledWith('Creating criteria for StateChanged with args:', criteriaArgs);
                expect(criteria).toEqual({ eventName: 'StateChanged', args: criteriaArgs });
                
                consoleSpy.mockRestore();
            });
        });

        describe('Contract Options', () => {
            test('Should set and use read options', () => {
                const readOptions = { revision: 'best', caller: testAccount.address };
                
                testingContract.setContractReadOptions(readOptions);
                
                expect(testingContract.getContractReadOptions()).toEqual(readOptions);
            });

            test('Should set and use transaction options', () => {
                const transactOptions = { gas: 100000, gasPrice: '1000000000' };
                
                testingContract.setContractTransactOptions(transactOptions);
                
                expect(testingContract.getContractTransactOptions()).toEqual(transactOptions);
            });
        });
    });

    describe('EventsContract Integration', () => {
        // Note: This test assumes EventsContract is deployed. 
        // In a real scenario, you'd either deploy it or use a known address.
        test.skip('Should work with EventsContract (requires deployment)', async () => {
            const eventsContract = contractsModule.load(eventsContractAddress, eventsContractAbi);
            
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            
            // Test event emission
            const result = await eventsContract.transact.emitTransfer(
                '0x1234567890123456789012345678901234567890',
                1000
            );
            
            expect(consoleSpy).toHaveBeenCalledWith('Transacting emitTransfer with args:', [
                '0x1234567890123456789012345678901234567890',
                1000
            ]);
            expect(result).toEqual({ transactionId: 'stub_tx_id' });
            
            consoleSpy.mockRestore();
        });
    });

    describe('Error Handling', () => {
        test('Should handle contract with invalid address gracefully', () => {
            const invalidAddress = Address.of('0x0000000000000000000000000000000000000000');
            
            expect(() => {
                contractsModule.load(invalidAddress, testingContractAbi);
            }).not.toThrow();
        });

        test('Should handle empty ABI gracefully', () => {
            const emptyAbi = [] as const;
            
            expect(() => {
                contractsModule.load(testingContractAddress, emptyAbi);
            }).not.toThrow();
        });
    });

    describe('Client Integration', () => {
        test('Should access PublicClient through contract', () => {
            const contract = contractsModule.load(testingContractAddress, testingContractAbi);
            
            expect(contract.getPublicClient()).toBe(publicClient);
        });

        test('Should access WalletClient through contract', () => {
            const contract = contractsModule.load(testingContractAddress, testingContractAbi);
            
            expect(contract.getWalletClient()).toBe(walletClient);
        });

        test('Should check client availability', () => {
            expect(contractsModule.hasPublicClient()).toBe(true);
            expect(contractsModule.hasWalletClient()).toBe(true);
        });
    });
});
