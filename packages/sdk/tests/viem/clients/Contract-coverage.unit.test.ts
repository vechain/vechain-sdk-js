import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import {
    getContract,
    type PublicClient,
    type WalletClient
} from '@viem/clients';
import { type Abi } from '@viem/utils';
import { Address, Hex, Revision } from '@common/vcdm';
import { Clause } from '@thor/thor-client';

// ERC20-like ABI for testing
const testAbi = [
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'totalSupply',
        stateMutability: 'view',
        inputs: [],
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
        inputs: [{ name: 'amount', type: 'uint256' }],
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
    }
] as const satisfies Abi;

// Mock PublicClient
const createMockPublicClient = (): jest.Mocked<PublicClient> =>
    ({
        call: (jest.fn() as any).mockResolvedValue({
            data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000'
        }),
        simulateCalls: (jest.fn() as any).mockResolvedValue([
            {
                data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                gasUsed: 21000n,
                reverted: false
            }
        ]),
        estimateGas: (jest.fn() as any).mockResolvedValue({
            totalGas: 21000n
        }),
        watchEvent: (jest.fn() as any).mockReturnValue(() => {}),
        getLogs: (jest.fn() as any).mockResolvedValue([]),
        createEventFilter: (jest.fn() as any).mockReturnValue({
            id: 'filter-1'
        })
    }) as any;

// Mock WalletClient
const createMockWalletClient = (): jest.Mocked<WalletClient> =>
    ({
        sendTransaction: (jest.fn() as any).mockResolvedValue(
            '0x123456789abcdef'
        )
    }) as any;

/**
 * Contract coverage tests - focused on uncovered lines
 * @group unit/clients
 */
describe('Contract - Coverage for uncovered lines', () => {
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

    describe('Read method with options extraction', () => {
        test('should call read method with revision option', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const accountAddress = '0x1234567890123456789012345678901234567890';
            const revision = Revision.of('best');

            await contract.read.balanceOf(accountAddress, { revision });

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                expect.objectContaining({
                    revision
                })
            );
        });

        test('should call read method with caller option', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const accountAddress = '0x1234567890123456789012345678901234567890';
            const caller = Address.of(
                '0x9876543210987654321098765432109876543210'
            );

            await contract.read.balanceOf(accountAddress, { caller });

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                expect.objectContaining({
                    caller
                })
            );
        });

        test('should call read method with gas option', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const accountAddress = '0x1234567890123456789012345678901234567890';
            const gas = 50000n;

            await contract.read.balanceOf(accountAddress, { gas });

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                expect.objectContaining({
                    gas
                })
            );
        });

        test('should call read method with multiple options', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const accountAddress = '0x1234567890123456789012345678901234567890';
            const options = {
                revision: Revision.of('best'),
                caller: Address.of(
                    '0x9876543210987654321098765432109876543210'
                ),
                gas: 50000n
            };

            await contract.read.balanceOf(accountAddress, options);

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                expect.objectContaining({
                    revision: options.revision,
                    caller: options.caller,
                    gas: options.gas
                })
            );
        });

        test('should call read method without options', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const accountAddress = '0x1234567890123456789012345678901234567890';

            await contract.read.balanceOf(accountAddress);

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                undefined
            );
        });

        test('should call read method with no args and no options', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            await contract.read.totalSupply();

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                undefined
            );
        });

        test('should call read method with regular object arg that is not options', async () => {
            // Create an ABI with a struct parameter to test non-options object
            const structAbi = [
                {
                    type: 'function',
                    name: 'processStruct',
                    stateMutability: 'view',
                    inputs: [
                        {
                            name: 'data',
                            type: 'tuple',
                            components: [
                                { name: 'value', type: 'uint256' },
                                { name: 'flag', type: 'bool' }
                            ]
                        }
                    ],
                    outputs: [{ name: '', type: 'uint256' }]
                }
            ] as const satisfies Abi;

            const contract = getContract({
                address: contractAddress,
                abi: structAbi,
                publicClient: mockPublicClient
            });

            const structData = { value: 100, flag: true };

            await contract.read.processStruct(structData);

            expect(mockPublicClient.call).toHaveBeenCalledWith(
                expect.any(Clause),
                undefined
            );
        });
    });

    describe('Write method with parameters', () => {
        test('should call write method with args and value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                walletClient: mockWalletClient
            });

            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;
            const value = 100n;

            await contract.write.transfer({
                args: [toAddress, amount],
                value
            });

            expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
                expect.objectContaining({
                    clauses: expect.arrayContaining([
                        expect.objectContaining({
                            to: contractAddress,
                            value
                        })
                    ])
                })
            );
        });

        test('should call write method with gas and gasPriceCoef', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                walletClient: mockWalletClient
            });

            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;
            const gas = 50000n;
            const gasPriceCoef = 128n;

            await contract.write.transfer({
                args: [toAddress, amount],
                gas,
                gasPriceCoef
            });

            expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
                expect.objectContaining({
                    gas: Number(gas),
                    gasPriceCoef: Number(gasPriceCoef)
                })
            );
        });

        test('should call write method for payable function with value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                walletClient: mockWalletClient
            });

            const amount = 1000n;
            const value = 5000n;

            await contract.write.deposit({
                args: [amount],
                value
            });

            expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
                expect.objectContaining({
                    clauses: expect.arrayContaining([
                        expect.objectContaining({
                            value
                        })
                    ])
                })
            );
        });

        test('should call write method with default value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                walletClient: mockWalletClient
            });

            const amount = 1000n;

            await contract.write.deposit({
                args: [amount]
            });

            expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
                expect.objectContaining({
                    clauses: expect.arrayContaining([expect.any(Clause)])
                })
            );
        });
    });

    describe('Simulate method with parameters', () => {
        test('should call simulate method with args and value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;
            const value = 100n;

            await contract.simulate.transfer({
                args: [toAddress, amount],
                value
            });

            expect(mockPublicClient.simulateCalls).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        to: contractAddress,
                        value
                    })
                ]),
                undefined
            );
        });

        test('should call simulate method with options', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;
            const options = {
                revision: Revision.of('best'),
                caller: Address.of('0x1234567890123456789012345678901234567890')
            };

            await contract.simulate.transfer({
                args: [toAddress, amount],
                options
            });

            expect(mockPublicClient.simulateCalls).toHaveBeenCalledWith(
                expect.any(Array),
                options
            );
        });

        test('should call simulate method with default value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const amount = 1000n;

            await contract.simulate.deposit({
                args: [amount]
            });

            expect(mockPublicClient.simulateCalls).toHaveBeenCalledWith(
                expect.any(Array),
                undefined
            );
        });
    });

    describe('EstimateGas method with parameters', () => {
        test('should call estimateGas method with caller and args', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const caller = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;

            const result = await contract.estimateGas.transfer(caller, {
                args: [toAddress, amount]
            });

            expect(mockPublicClient.estimateGas).toHaveBeenCalledWith(
                expect.any(Array),
                caller,
                undefined
            );
            expect(result).toBe(21000n);
        });

        test('should call estimateGas method with value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const caller = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;
            const value = 500n;

            await contract.estimateGas.transfer(caller, {
                args: [toAddress, amount],
                value
            });

            expect(mockPublicClient.estimateGas).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        value
                    })
                ]),
                caller,
                undefined
            );
        });

        test('should call estimateGas method with revision', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const caller = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;
            const revision = Revision.of('best');

            await contract.estimateGas.transfer(caller, {
                args: [toAddress, amount],
                revision
            });

            expect(mockPublicClient.estimateGas).toHaveBeenCalledWith(
                expect.any(Array),
                caller,
                expect.objectContaining({
                    revision
                })
            );
        });

        test('should call estimateGas method with default value', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const caller = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const amount = 1000n;

            await contract.estimateGas.deposit(caller, {
                args: [amount]
            });

            expect(mockPublicClient.estimateGas).toHaveBeenCalledWith(
                expect.any(Array),
                caller,
                undefined
            );
        });
    });

    describe('Event methods with parameters', () => {
        test('should watch event with onError callback', () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const onLogs = jest.fn();
            const onError = jest.fn();

            contract.events.Transfer.watch({
                onLogs,
                onError
            });

            expect(mockPublicClient.watchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    onLogs,
                    onError
                })
            );
        });

        test('should watch event with fromBlock', () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const onLogs = jest.fn();
            const fromBlock = 12345;

            contract.events.Transfer.watch({
                onLogs,
                fromBlock
            });

            expect(mockPublicClient.watchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    fromBlock: expect.any(Hex)
                })
            );
        });

        test('should get event logs with filter options', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const fromBlock = 100n;
            const toBlock = 200n;

            await contract.events.Transfer.getLogs({
                fromBlock,
                toBlock
            });

            expect(mockPublicClient.createEventFilter).toHaveBeenCalledWith(
                expect.objectContaining({
                    fromBlock,
                    toBlock
                })
            );
            expect(mockPublicClient.getLogs).toHaveBeenCalled();
        });

        test('should get event logs without options', async () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            await contract.events.Transfer.getLogs();

            expect(mockPublicClient.createEventFilter).toHaveBeenCalled();
            expect(mockPublicClient.getLogs).toHaveBeenCalled();
        });

        test('should create event filter with options', () => {
            const contract = getContract({
                address: contractAddress,
                abi: testAbi,
                publicClient: mockPublicClient
            });

            const fromBlock = 100n;
            const toBlock = 200n;

            contract.events.Transfer.createEventFilter({
                fromBlock,
                toBlock
            });

            expect(mockPublicClient.createEventFilter).toHaveBeenCalled();
        });
    });
});
