import { describe, expect, test, jest } from '@jest/globals';
import { ContractsModule, Contract, ContractFactory } from '../../../../src/thor/thor-client/contracts';
import { Address } from '../../../../src/common/vcdm';
import { type PublicClient, type WalletClient } from '../../../../src/viem/clients';

// Simple ERC20 ABI for testing
const erc20Abi = [
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
        type: 'event',
        name: 'Transfer',
        inputs: [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false }
        ]
    }
] as const;

// Mock clients
const createMockPublicClient = (): PublicClient => ({
    thorNetworks: 'SOLONET',
    call: jest.fn(),
    simulateCalls: jest.fn(),
    estimateGas: jest.fn(),
    watchEvent: jest.fn(),
    getLogs: jest.fn(),
    createEventFilter: jest.fn()
} as any);

const createMockWalletClient = (): WalletClient => ({
    thorNetworks: 'SOLONET',
    account: Address.of('0x1234567890123456789012345678901234567890'),
    sendTransaction: jest.fn()
} as any);

const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn()
});

/**
 * @group unit/contracts
 */
describe('ContractsModule', () => {
    describe('Constructor', () => {
        test('Should create instance with no clients', () => {
            const contractsModule = new ContractsModule();
            
            expect(contractsModule).toBeInstanceOf(ContractsModule);
            expect(contractsModule.getPublicClient()).toBeUndefined();
            expect(contractsModule.getWalletClient()).toBeUndefined();
            expect(contractsModule.hasPublicClient()).toBe(false);
            expect(contractsModule.hasWalletClient()).toBe(false);
        });

        test('Should create instance with PublicClient only', () => {
            const publicClient = createMockPublicClient();
            const contractsModule = new ContractsModule(publicClient);
            
            expect(contractsModule.getPublicClient()).toBe(publicClient);
            expect(contractsModule.getWalletClient()).toBeUndefined();
            expect(contractsModule.hasPublicClient()).toBe(true);
            expect(contractsModule.hasWalletClient()).toBe(false);
        });

        test('Should create instance with WalletClient only', () => {
            const walletClient = createMockWalletClient();
            const contractsModule = new ContractsModule(undefined, walletClient);
            
            expect(contractsModule.getPublicClient()).toBeUndefined();
            expect(contractsModule.getWalletClient()).toBe(walletClient);
            expect(contractsModule.hasPublicClient()).toBe(false);
            expect(contractsModule.hasWalletClient()).toBe(true);
        });

        test('Should create instance with both clients', () => {
            const publicClient = createMockPublicClient();
            const walletClient = createMockWalletClient();
            const contractsModule = new ContractsModule(publicClient, walletClient);
            
            expect(contractsModule.getPublicClient()).toBe(publicClient);
            expect(contractsModule.getWalletClient()).toBe(walletClient);
            expect(contractsModule.hasPublicClient()).toBe(true);
            expect(contractsModule.hasWalletClient()).toBe(true);
        });
    });

    describe('Client Management', () => {
        test('Should set and get PublicClient', () => {
            const contractsModule = new ContractsModule();
            const publicClient = createMockPublicClient();
            
            contractsModule.setPublicClient(publicClient);
            
            expect(contractsModule.getPublicClient()).toBe(publicClient);
            expect(contractsModule.hasPublicClient()).toBe(true);
        });

        test('Should set and get WalletClient', () => {
            const contractsModule = new ContractsModule();
            const walletClient = createMockWalletClient();
            
            contractsModule.setWalletClient(walletClient);
            
            expect(contractsModule.getWalletClient()).toBe(walletClient);
            expect(contractsModule.hasWalletClient()).toBe(true);
        });
    });

    describe('Contract Loading', () => {
        test('Should load contract without signer', () => {
            const publicClient = createMockPublicClient();
            const contractsModule = new ContractsModule(publicClient);
            const contractAddress = Address.of('0x0000000000000000000000000000000000000000');
            
            const contract = contractsModule.load(contractAddress, erc20Abi);
            
            expect(contract).toBeInstanceOf(Contract);
            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(erc20Abi);
            expect(contract.contractsModule).toBe(contractsModule);
            expect(contract.getSigner()).toBeUndefined();
        });

        test('Should load contract with signer', () => {
            const publicClient = createMockPublicClient();
            const contractsModule = new ContractsModule(publicClient);
            const contractAddress = Address.of('0x0000000000000000000000000000000000000000');
            const signer = createMockSigner();
            
            const contract = contractsModule.load(contractAddress, erc20Abi, signer);
            
            expect(contract).toBeInstanceOf(Contract);
            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(erc20Abi);
            expect(contract.contractsModule).toBe(contractsModule);
            expect(contract.getSigner()).toBe(signer);
        });

        test('Should create contract with proper method interfaces', () => {
            const publicClient = createMockPublicClient();
            const contractsModule = new ContractsModule(publicClient);
            const contractAddress = Address.of('0x0000000000000000000000000000000000000000');
            
            const contract = contractsModule.load(contractAddress, erc20Abi);
            
            // Check that read methods exist for view functions
            expect(contract.read).toHaveProperty('balanceOf');
            expect(typeof contract.read.balanceOf).toBe('function');
            
            // Check that transact methods exist for non-payable functions
            expect(contract.transact).toHaveProperty('transfer');
            expect(typeof contract.transact.transfer).toBe('function');
            
            // Check that clause methods exist
            expect(contract.clause).toHaveProperty('balanceOf');
            expect(contract.clause).toHaveProperty('transfer');
            expect(typeof contract.clause.balanceOf).toBe('function');
            expect(typeof contract.clause.transfer).toBe('function');
            
            // Check that filter methods exist for events
            expect(contract.filters).toHaveProperty('Transfer');
            expect(typeof contract.filters.Transfer).toBe('function');
            
            // Check that criteria methods exist for events
            expect(contract.criteria).toHaveProperty('Transfer');
            expect(typeof contract.criteria.Transfer).toBe('function');
        });
    });

    describe('ContractFactory Creation', () => {
        test('Should create ContractFactory', () => {
            const publicClient = createMockPublicClient();
            const walletClient = createMockWalletClient();
            const contractsModule = new ContractsModule(publicClient, walletClient);
            const signer = createMockSigner();
            const bytecode = '0x608060405234801561001057600080fd5b50...'; // Mock bytecode
            
            const factory = contractsModule.createContractFactory(erc20Abi, bytecode, signer);
            
            expect(factory).toBeInstanceOf(ContractFactory);
            expect(factory.getAbi()).toBe(erc20Abi);
            expect(factory.getBytecode()).toBe(bytecode);
            expect(factory.getSigner()).toBe(signer);
        });
    });

    describe('Type Safety', () => {
        test('Should maintain ABI type information', () => {
            const publicClient = createMockPublicClient();
            const contractsModule = new ContractsModule(publicClient);
            const contractAddress = Address.of('0x0000000000000000000000000000000000000000');
            
            // This should compile without type errors due to proper generic typing
            const contract = contractsModule.load(contractAddress, erc20Abi);
            
            // TypeScript should infer the correct method names from the ABI
            expect(contract.read).toHaveProperty('balanceOf');
            expect(contract.transact).toHaveProperty('transfer');
            expect(contract.filters).toHaveProperty('Transfer');
        });
    });

    describe('Error Handling', () => {
        test('Should handle contract creation with empty ABI', () => {
            const publicClient = createMockPublicClient();
            const contractsModule = new ContractsModule(publicClient);
            const contractAddress = Address.of('0x0000000000000000000000000000000000000000');
            const emptyAbi = [] as const;
            
            const contract = contractsModule.load(contractAddress, emptyAbi);
            
            expect(contract).toBeInstanceOf(Contract);
            expect(contract.abi).toEqual(emptyAbi);
            // Should have empty method objects
            expect(Object.keys(contract.read)).toHaveLength(0);
            expect(Object.keys(contract.transact)).toHaveLength(0);
            expect(Object.keys(contract.filters)).toHaveLength(0);
        });
    });
});
