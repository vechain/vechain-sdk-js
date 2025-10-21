/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test } from '@jest/globals';
import { getContract } from '../../../src/viem/clients/Contract';
import { Address } from '../../../src/common/vcdm';

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
const mockPublicClient = {
    call: jest.fn(),
    simulateCalls: jest.fn(),
    estimateGas: jest.fn(),
    watchEvent: jest.fn(),
    getLogs: jest.fn(),
    createEventFilter: jest.fn()
} as any;

const mockWalletClient = {
    account: Address.of('0x1234567890123456789012345678901234567890'),
    sendTransaction: jest.fn()
} as any;

describe('ContractAdapter Integration', () => {
    test('Should create contract with viem-compatible interface', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        // Should have viem-compatible interface
        expect(contract).toHaveProperty('address');
        expect(contract).toHaveProperty('abi');
        expect(contract).toHaveProperty('read');
        expect(contract).toHaveProperty('write');
        expect(contract).toHaveProperty('simulate');
        expect(contract).toHaveProperty('estimateGas');
        expect(contract).toHaveProperty('events');

        // Should have VeChain-specific interface
        expect(contract).toHaveProperty('_vechain');
        expect(contract._vechain).toHaveProperty('setReadOptions');
        expect(contract._vechain).toHaveProperty('setTransactOptions');
        expect(contract._vechain).toHaveProperty('clause');
        expect(contract._vechain).toHaveProperty('filters');
    });

    test('Should have read methods for view functions', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        expect(contract.read).toHaveProperty('balanceOf');
        expect(typeof contract.read.balanceOf).toBe('function');
    });

    test('Should have write methods for state-changing functions', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient,
            walletClient: mockWalletClient
        });

        expect(contract.write).toHaveProperty('transfer');
        expect(typeof contract.write.transfer).toBe('function');
    });

    test('Should have simulate methods', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        expect(contract.simulate).toHaveProperty('balanceOf');
        expect(contract.simulate).toHaveProperty('transfer');
        expect(typeof contract.simulate.balanceOf).toBe('function');
        expect(typeof contract.simulate.transfer).toBe('function');
    });

    test('Should have estimateGas methods', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        expect(contract.estimateGas).toHaveProperty('balanceOf');
        expect(contract.estimateGas).toHaveProperty('transfer');
        expect(typeof contract.estimateGas.balanceOf).toBe('function');
        expect(typeof contract.estimateGas.transfer).toBe('function');
    });

    test('Should have event methods', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        expect(contract.events).toHaveProperty('Transfer');
        expect(contract.events.Transfer).toHaveProperty('watch');
        expect(contract.events.Transfer).toHaveProperty('getLogs');
        expect(contract.events.Transfer).toHaveProperty('createEventFilter');
        expect(typeof contract.events.Transfer.watch).toBe('function');
        expect(typeof contract.events.Transfer.getLogs).toBe('function');
        expect(typeof contract.events.Transfer.createEventFilter).toBe(
            'function'
        );
    });

    test('Should have VeChain-specific clause methods', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        expect(contract._vechain?.clause).toHaveProperty('balanceOf');
        expect(contract._vechain?.clause).toHaveProperty('transfer');
        expect(typeof contract._vechain?.clause.balanceOf).toBe('function');
        expect(typeof contract._vechain?.clause.transfer).toBe('function');
    });

    test('Should have VeChain-specific filter methods', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        expect(contract._vechain?.filters).toHaveProperty('Transfer');
        expect(typeof contract._vechain?.filters.Transfer).toBe('function');
    });

    test('Should throw error when no clients provided', () => {
        expect(() => {
            getContract({
                address: Address.of(
                    '0x0000000000000000000000000000000000000000'
                ),
                abi: erc20Abi
            });
        }).toThrow(
            'At least one of publicClient or walletClient must be provided'
        );
    });

    test('VeChain-specific methods should work', () => {
        const contract = getContract({
            address: Address.of('0x0000000000000000000000000000000000000000'),
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        // Test VeChain-specific functionality
        expect(contract._vechain).toBeDefined();
        expect(contract._vechain?.contract).toBeDefined();

        // Test setReadOptions
        expect(() => {
            contract._vechain?.setReadOptions({ revision: 'best' });
        }).not.toThrow();

        // Test setTransactOptions
        expect(() => {
            contract._vechain?.setTransactOptions({ gas: 21000 });
        }).not.toThrow();

        // Test that clause and filters objects exist
        expect(contract._vechain?.clause).toBeDefined();
        expect(contract._vechain?.filters).toBeDefined();

        // Test that clause methods exist for functions
        expect(contract._vechain?.clause).toHaveProperty('balanceOf');
        expect(contract._vechain?.clause).toHaveProperty('transfer');

        // Test that filter methods exist for events
        expect(contract._vechain?.filters).toHaveProperty('Transfer');
    });
});
