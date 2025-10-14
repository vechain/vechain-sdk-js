import { describe, expect, test, jest } from '@jest/globals';
import {
    Contract,
    ContractsModule
} from '../../../../src/thor/thor-client/contracts';
import { Address } from '../../../../src/common/vcdm';
import {
    type PublicClient,
    type WalletClient
} from '../../../../src/viem/clients';
import {
    ContractCallError,
    InvalidTransactionField
} from '../../../../src/common/errors';

// Complex contract ABI for testing
const complexContractAbi = [
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    },
    {
        type: 'function',
        name: 'deposit',
        stateMutability: 'payable',
        inputs: [],
        outputs: []
    },
    {
        type: 'function',
        name: 'calculate',
        stateMutability: 'pure',
        inputs: [
            { name: 'a', type: 'uint256' },
            { name: 'b', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'uint256' }]
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
        name: 'Deposit',
        inputs: [
            { name: 'account', type: 'address', indexed: true },
            { name: 'amount', type: 'uint256', indexed: false }
        ]
    }
] as const;

// Mock clients
const createMockPublicClient = (): PublicClient =>
    ({
        thorNetworks: 'SOLONET',
        call: jest.fn(),
        simulateCalls: jest.fn(),
        estimateGas: jest.fn(),
        watchEvent: jest.fn(),
        getLogs: jest.fn(),
        createEventFilter: jest.fn()
    }) as any;

const createMockWalletClient = (): WalletClient =>
    ({
        thorNetworks: 'SOLONET',
        account: Address.of('0x1234567890123456789012345678901234567890'),
        sendTransaction: jest.fn()
    }) as any;

const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn()
});

/**
 * @group unit/contracts
 */
describe('Contract Advanced Functionality', () => {
    const contractAddress = Address.of(
        '0x0000000000000000000000000000000000000000'
    );
    let publicClient: PublicClient;
    let walletClient: WalletClient;
    let contractsModule: ContractsModule;
    let signer: any;

    beforeEach(() => {
        publicClient = createMockPublicClient();
        walletClient = createMockWalletClient();
        contractsModule = new ContractsModule(publicClient, walletClient);
        signer = createMockSigner();
    });

    describe('Method Generation and Classification', () => {
        test('Should generate read methods for view functions', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(contract.read).toHaveProperty('balanceOf');
            expect(contract.read).toHaveProperty('calculate');
            expect(typeof contract.read.balanceOf).toBe('function');
            expect(typeof contract.read.calculate).toBe('function');
        });

        test('Should generate transact methods for nonpayable and payable functions', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(contract.transact).toHaveProperty('transfer');
            expect(contract.transact).toHaveProperty('deposit');
            expect(typeof contract.transact.transfer).toBe('function');
            expect(typeof contract.transact.deposit).toBe('function');
        });

        test('Should generate clause methods for all functions', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(contract.clause).toHaveProperty('balanceOf');
            expect(contract.clause).toHaveProperty('transfer');
            expect(contract.clause).toHaveProperty('deposit');
            expect(contract.clause).toHaveProperty('calculate');
            expect(typeof contract.clause.balanceOf).toBe('function');
            expect(typeof contract.clause.transfer).toBe('function');
            expect(typeof contract.clause.deposit).toBe('function');
            expect(typeof contract.clause.calculate).toBe('function');
        });

        test('Should generate filter methods for events', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(contract.filters).toHaveProperty('Transfer');
            expect(contract.filters).toHaveProperty('Deposit');
            expect(typeof contract.filters.Transfer).toBe('function');
            expect(typeof contract.filters.Deposit).toBe('function');
        });

        test('Should generate criteria methods for events', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(contract.criteria).toHaveProperty('Transfer');
            expect(contract.criteria).toHaveProperty('Deposit');
            expect(typeof contract.criteria.Transfer).toBe('function');
            expect(typeof contract.criteria.Deposit).toBe('function');
        });
    });

    describe('ABI Method Resolution', () => {
        test('Should resolve function ABI correctly', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            const balanceOfAbi = contract.getFunctionAbi('balanceOf');
            expect(balanceOfAbi).toBeDefined();
            expect(balanceOfAbi.name).toBe('balanceOf');
            expect(balanceOfAbi.stateMutability).toBe('view');

            const transferAbi = contract.getFunctionAbi('transfer');
            expect(transferAbi).toBeDefined();
            expect(transferAbi.name).toBe('transfer');
            expect(transferAbi.stateMutability).toBe('nonpayable');
        });

        test('Should resolve event ABI correctly', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            const transferEventAbi = contract.getEventAbi('Transfer');
            expect(transferEventAbi).toBeDefined();
            expect(transferEventAbi.name).toBe('Transfer');
            expect(transferEventAbi.type).toBe('event');

            const depositEventAbi = contract.getEventAbi('Deposit');
            expect(depositEventAbi).toBeDefined();
            expect(depositEventAbi.name).toBe('Deposit');
            expect(depositEventAbi.type).toBe('event');
        });

        test('Should throw error for non-existent function', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(() =>
                contract.getFunctionAbi('nonExistentFunction')
            ).toThrow('Function nonExistentFunction not found in ABI');
        });

        test('Should throw error for non-existent event', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            expect(() => contract.getEventAbi('NonExistentEvent')).toThrow(
                'Event NonExistentEvent not found in ABI'
            );
        });
    });

    describe('Function Data Encoding', () => {
        // Note: encodeFunctionData method was removed as it's now handled directly by viem
        // Note: encodeFunctionData method was removed as it's now handled directly by viem
        // Note: encodeFunctionData method was removed as it's now handled directly by viem
    });

    describe('Event Selector Generation', () => {
        // Note: getEventSelector method was removed as it's now handled directly by viem
    });

    describe('Client Access', () => {
        test('Should provide access to PublicClient', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            const client = contract.getPublicClient();
            expect(client).toBe(publicClient);
        });

        test('Should provide access to WalletClient', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            const client = contract.getWalletClient();
            expect(client).toBe(walletClient);
        });

        test('Should handle missing clients gracefully', () => {
            const contractsModuleWithoutClients = new ContractsModule();
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModuleWithoutClients
            );

            const publicClient = contract.getPublicClient();
            const walletClient = contract.getWalletClient();

            expect(publicClient).toBeUndefined();
            expect(walletClient).toBeUndefined();
        });
    });

    describe('Options Management', () => {
        test('Should manage contract call options', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            const options = {
                caller: '0x1234567890123456789012345678901234567890',
                gas: 1000000
            };
            contract.setContractReadOptions(options);

            const retrievedOptions = contract.getContractReadOptions();
            expect(retrievedOptions).toEqual(options);
        });

        test('Should manage contract transaction options', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            const options = { value: '1000000000000000000', gas: 2000000 };
            contract.setContractTransactOptions(options);

            const retrievedOptions = contract.getContractTransactOptions();
            expect(retrievedOptions).toEqual(options);
        });

        test('Should clear contract call options', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            contract.setContractReadOptions({
                caller: '0x1234567890123456789012345678901234567890'
            });
            contract.clearContractReadOptions();

            const options = contract.getContractReadOptions();
            expect(options).toEqual({});
        });

        test('Should clear contract transaction options', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            contract.setContractTransactOptions({
                value: '1000000000000000000'
            });
            contract.clearContractTransactOptions();

            const options = contract.getContractTransactOptions();
            expect(options).toEqual({});
        });
    });

    describe('Signer Management', () => {
        test('Should set and get signer', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );

            contract.setSigner(signer);
            const retrievedSigner = contract.getSigner();

            expect(retrievedSigner).toBe(signer);
        });

        test('Should handle signer changes', () => {
            const contract = new Contract(
                contractAddress,
                complexContractAbi,
                contractsModule
            );
            const newSigner = createMockSigner();

            contract.setSigner(signer);
            expect(contract.getSigner()).toBe(signer);

            contract.setSigner(newSigner);
            expect(contract.getSigner()).toBe(newSigner);
        });
    });

    describe('Error Handling', () => {
        test('Should handle empty ABI gracefully', () => {
            const emptyAbi = [] as const;
            const contract = new Contract(
                contractAddress,
                emptyAbi,
                contractsModule
            );

            expect(contract.abi).toEqual(emptyAbi);
            expect(Object.keys(contract.read)).toHaveLength(0);
            expect(Object.keys(contract.transact)).toHaveLength(0);
            expect(Object.keys(contract.filters)).toHaveLength(0);
            expect(Object.keys(contract.clause)).toHaveLength(0);
            expect(Object.keys(contract.criteria)).toHaveLength(0);
        });

        test('Should handle malformed ABI gracefully', () => {
            const malformedAbi = [
                { type: 'function', name: 'test' } // Missing required fields
            ] as any;

            const contract = new Contract(
                contractAddress,
                malformedAbi,
                contractsModule
            );

            expect(contract.abi).toBe(malformedAbi);
            // Should not throw during initialization
        });
    });
});
