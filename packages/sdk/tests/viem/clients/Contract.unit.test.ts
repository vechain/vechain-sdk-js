import { describe, expect, test, jest } from '@jest/globals';
import {
    getContract,
    type PublicClient,
    type WalletClient
} from '@viem/clients';
import { type Abi } from '@viem/utils';
import { Address } from '@common/vcdm';

// Example ERC20 ABI (simplified)
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
        type: 'function',
        name: 'approve',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
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
    },
    {
        type: 'event',
        name: 'Approval',
        inputs: [
            { name: 'owner', type: 'address', indexed: true },
            { name: 'spender', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false }
        ]
    }
] as const satisfies Abi;

// Mock PublicClient
const createMockPublicClient = (): jest.Mocked<PublicClient> =>
    ({
        call: (jest.fn() as any).mockResolvedValue({
            data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        }),
        simulateCalls: (jest.fn() as any).mockResolvedValue({
            results: [
                {
                    data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                    gasUsed: 21000,
                    reverted: false
                }
            ]
        }),
        estimateGas: (jest.fn() as any).mockResolvedValue(21000n),
        watchEvent: (jest.fn() as any).mockReturnValue(() => {}),
        getLogs: (jest.fn() as any).mockResolvedValue([]),
        createEventFilter: (jest.fn() as any).mockReturnValue({
            id: 'filter-1'
        })
    }) as any;

// Mock WalletClient
const createMockWalletClient = (): jest.Mocked<WalletClient> =>
    ({
        sendTransaction: (jest.fn() as any).mockResolvedValue({
            hash: '0x123456789abcdef',
            id: 'tx-1'
        })
    }) as any;

/**
 * Contract getContract function tests
 * @group unit/clients
 */
describe('getContract function', () => {
    const contractAddress = Address.of(
        '0x0000000000000000000000000000456E65726779'
    );
    let mockPublicClient: jest.Mocked<PublicClient>;
    let mockWalletClient: jest.Mocked<WalletClient>;

    beforeEach(() => {
        mockPublicClient = createMockPublicClient();
        mockWalletClient = createMockWalletClient();
        jest.clearAllMocks();
    });

    test('should create read-only contract instance with PublicClient only', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        // Should have read methods
        expect(contract.read).toBeDefined();
        expect(contract.read.balanceOf).toBeDefined();
        expect(typeof contract.read.balanceOf).toBe('function');

        // Should have simulate methods
        expect(contract.simulate).toBeDefined();
        expect(contract.simulate.balanceOf).toBeDefined();
        expect(contract.simulate.transfer).toBeDefined();
        expect(typeof contract.simulate.transfer).toBe('function');

        // Should have estimateGas methods
        expect(contract.estimateGas).toBeDefined();
        expect(contract.estimateGas.transfer).toBeDefined();
        expect(typeof contract.estimateGas.transfer).toBe('function');

        // Should have events
        expect(contract.events).toBeDefined();
        expect(contract.events.Transfer).toBeDefined();
        expect(contract.events.Transfer.watch).toBeDefined();
        expect(contract.events.Transfer.getLogs).toBeDefined();
        expect(contract.events.Transfer.createEventFilter).toBeDefined();

        // Should NOT have write methods (no wallet client)
        expect(contract.write).toBeDefined();
        expect(Object.keys(contract.write)).toHaveLength(0);
    });

    test('should create full-featured contract instance with both clients', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            publicClient: mockPublicClient,
            walletClient: mockWalletClient
        });

        // Should have all method types
        expect(contract.read).toBeDefined();
        expect(contract.write).toBeDefined();
        expect(contract.simulate).toBeDefined();
        expect(contract.estimateGas).toBeDefined();
        expect(contract.events).toBeDefined();

        // Should have write methods
        expect(contract.write.transfer).toBeDefined();
        expect(contract.write.approve).toBeDefined();
        expect(typeof contract.write.transfer).toBe('function');

        // Should have read methods
        expect(contract.read.balanceOf).toBeDefined();
        expect(typeof contract.read.balanceOf).toBe('function');

        // Should have events
        expect(contract.events.Transfer).toBeDefined();
        expect(contract.events.Approval).toBeDefined();
    });

    test('should create write-only contract instance with WalletClient only', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            walletClient: mockWalletClient
        });

        // Should have write methods
        expect(contract.write).toBeDefined();
        expect(contract.write.transfer).toBeDefined();
        expect(contract.write.approve).toBeDefined();
        expect(typeof contract.write.transfer).toBe('function');

        // Should NOT have read methods (no public client)
        expect(contract.read).toBeDefined();
        expect(Object.keys(contract.read)).toHaveLength(0);

        // Should NOT have events (no public client)
        expect(contract.events).toBeDefined();
        expect(Object.keys(contract.events)).toHaveLength(0);

        // Should NOT have simulate methods (no public client)
        expect(contract.simulate).toBeDefined();
        expect(Object.keys(contract.simulate)).toHaveLength(0);

        // Should NOT have estimateGas methods (no public client)
        expect(contract.estimateGas).toBeDefined();
        expect(Object.keys(contract.estimateGas)).toHaveLength(0);
    });

    test('should have correct contract properties', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            publicClient: mockPublicClient,
            walletClient: mockWalletClient
        });

        expect(contract.address).toBe(contractAddress);
        expect(contract.abi).toBe(erc20Abi);
    });

    test('should create proper method signatures for read functions', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        // Check that read methods are functions
        expect(typeof contract.read.balanceOf).toBe('function');

        // Check method names match ABI
        const readMethodNames = Object.keys(contract.read);
        expect(readMethodNames).toContain('balanceOf');

        // Should only have view/pure functions in read
        expect(readMethodNames).not.toContain('transfer');
        expect(readMethodNames).not.toContain('approve');
    });

    test('should create proper method signatures for write functions', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            walletClient: mockWalletClient
        });

        // Check that write methods are functions
        expect(typeof contract.write.transfer).toBe('function');
        expect(typeof contract.write.approve).toBe('function');

        // Check method names match ABI
        const writeMethodNames = Object.keys(contract.write);
        expect(writeMethodNames).toContain('transfer');
        expect(writeMethodNames).toContain('approve');

        // Should only have non-view functions in write
        expect(writeMethodNames).not.toContain('balanceOf');
    });

    test('should create proper event interfaces', () => {
        const contract = getContract({
            address: contractAddress,
            abi: erc20Abi,
            publicClient: mockPublicClient
        });

        // Check that events exist
        expect(contract.events.Transfer).toBeDefined();
        expect(contract.events.Approval).toBeDefined();

        // Check event methods
        expect(typeof contract.events.Transfer.watch).toBe('function');
        expect(typeof contract.events.Transfer.getLogs).toBe('function');
        expect(typeof contract.events.Transfer.createEventFilter).toBe(
            'function'
        );

        expect(typeof contract.events.Approval.watch).toBe('function');
        expect(typeof contract.events.Approval.getLogs).toBe('function');
        expect(typeof contract.events.Approval.createEventFilter).toBe(
            'function'
        );
    });

    test('should handle empty ABI gracefully', () => {
        const emptyAbi = [] as const satisfies Abi;

        const contract = getContract({
            address: contractAddress,
            abi: emptyAbi,
            publicClient: mockPublicClient
        });

        expect(contract.read).toBeDefined();
        expect(contract.write).toBeDefined();
        expect(contract.simulate).toBeDefined();
        expect(contract.estimateGas).toBeDefined();
        expect(contract.events).toBeDefined();

        // All should be empty objects
        expect(Object.keys(contract.read)).toHaveLength(0);
        expect(Object.keys(contract.write)).toHaveLength(0);
        expect(Object.keys(contract.simulate)).toHaveLength(0);
        expect(Object.keys(contract.estimateGas)).toHaveLength(0);
        expect(Object.keys(contract.events)).toHaveLength(0);
    });

    test('should throw error when no clients provided', () => {
        expect(() => {
            getContract({
                address: contractAddress,
                abi: erc20Abi
            });
        }).toThrow();
    });

    test('should separate view and non-view functions correctly', () => {
        const mixedAbi = [
            {
                type: 'function',
                name: 'viewFunction',
                stateMutability: 'view',
                inputs: [],
                outputs: [{ name: '', type: 'uint256' }]
            },
            {
                type: 'function',
                name: 'pureFunction',
                stateMutability: 'pure',
                inputs: [],
                outputs: [{ name: '', type: 'uint256' }]
            },
            {
                type: 'function',
                name: 'nonpayableFunction',
                stateMutability: 'nonpayable',
                inputs: [],
                outputs: []
            },
            {
                type: 'function',
                name: 'payableFunction',
                stateMutability: 'payable',
                inputs: [],
                outputs: []
            }
        ] as const satisfies Abi;

        const contract = getContract({
            address: contractAddress,
            abi: mixedAbi,
            publicClient: mockPublicClient,
            walletClient: mockWalletClient
        });

        // Read methods should only have view/pure functions
        const readMethods = Object.keys(contract.read);
        expect(readMethods).toContain('viewFunction');
        expect(readMethods).toContain('pureFunction');
        expect(readMethods).not.toContain('nonpayableFunction');
        expect(readMethods).not.toContain('payableFunction');

        // Write methods should only have nonpayable/payable functions
        const writeMethods = Object.keys(contract.write);
        expect(writeMethods).toContain('nonpayableFunction');
        expect(writeMethods).toContain('payableFunction');
        expect(writeMethods).not.toContain('viewFunction');
        expect(writeMethods).not.toContain('pureFunction');
    });
});
