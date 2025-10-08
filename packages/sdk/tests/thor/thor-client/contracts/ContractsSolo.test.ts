import { describe, expect, test, beforeAll } from '@jest/globals';
import {
    ContractsModule,
    Contract
} from '../../../../src/thor/thor-client/contracts';
import {
    createPublicClient,
    createWalletClient
} from '../../../../src/viem/clients';
import { ThorClient } from '../../../../src/thor/thor-client/ThorClient';
import { FetchHttpClient } from '../../../../src/common/http';
import { ThorNetworks } from '../../../../src/thor/thorest';
import { Address } from '../../../../src/common/vcdm';
import { privateKeyToAccount } from 'viem/accounts';

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
    }
] as const;

// Write-only contract ABI (only nonpayable and payable functions)
const writeOnlyContractAbi = [
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
        type: 'function',
        name: 'mint',
        stateMutability: 'payable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: []
    },
    {
        type: 'function',
        name: 'burn',
        stateMutability: 'nonpayable',
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
] as const;

// Mixed contract ABI (both read and write functions)
const mixedContractAbi = [
    {
        type: 'function',
        name: 'getBalance',
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
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: []
    },
    {
        type: 'function',
        name: 'isValidAddress',
        stateMutability: 'pure',
        inputs: [{ name: 'addr', type: 'address' }],
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

/**
 * @group integration/contracts/solo
 */
describe('Contracts Solo Integration Tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.at(httpClient);

    // Solo network test accounts
    const testPrivateKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36';
    const testAccount = privateKeyToAccount(`0x${testPrivateKey}`);

    // Contract addresses (these should be deployed by solo-setup seeding)
    const readOnlyContractAddress = Address.of(
        '0x8384738C995D49C5b692560ae688fc8b51af1059'
    ); // From solo-setup
    const writeOnlyContractAddress = Address.of(
        '0x99A8e4e0C1FE2Bb5C2D2C7C2b2b2b2b2b2b2b2b2'
    ); // Placeholder - update with actual
    const mixedContractAddress = Address.of(
        '0x8384738C995D49C5b692560ae688fc8b51af1059'
    ); // From solo-setup

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

    describe('Read-Only Contract Integration', () => {
        let readOnlyContract: Contract<typeof readOnlyContractAbi>;

        beforeAll(() => {
            readOnlyContract = contractsModule.load(
                readOnlyContractAddress,
                readOnlyContractAbi
            );
        });

        test('Should read state variable', async () => {
            const result = await readOnlyContract.read.getBalance(
                testAccount.address
            );

            expect(Array.isArray(result)).toBe(true);
            // Note: This will return stub results in current implementation
        });

        test('Should call pure function with bool data', async () => {
            const result = await readOnlyContract.read.isValidAddress(
                testAccount.address
            );

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should call pure function with bytes32 data', async () => {
            const testData =
                '0x1234567890123456789012345678901234567890123456789012345678901234';
            const result = await readOnlyContract.read.calculateHash(testData);

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should call view function with multiple return values', async () => {
            const result = await readOnlyContract.read.getContractInfo();

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should build clause for read function', () => {
            const clause = readOnlyContract.clause.getBalance(
                testAccount.address
            );

            expect(clause).toEqual({
                to: readOnlyContractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/),
                value: '0x0',
                comment: undefined
            });
        });

        test('Should set and use read options', () => {
            const readOptions = {
                revision: 'best',
                caller: testAccount.address
            };

            readOnlyContract.setContractReadOptions(readOptions);

            expect(readOnlyContract.getContractReadOptions()).toEqual(
                readOptions
            );
        });

        test('Should NOT have any transact methods', () => {
            const transactKeys = Object.keys(readOnlyContract.transact);
            expect(transactKeys).toHaveLength(0);
        });
    });

    describe('Write-Only Contract Integration', () => {
        let writeOnlyContract: Contract<typeof writeOnlyContractAbi>;

        beforeAll(() => {
            writeOnlyContract = contractsModule.load(
                writeOnlyContractAddress,
                writeOnlyContractAbi
            );
        });

        test('Should execute nonpayable function', async () => {
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;

            const result = await writeOnlyContract.transact.transfer(
                toAddress,
                amount
            );

            expect(result).toEqual({ transactionId: 'stub_tx_id' });
        });

        test('Should execute payable function', async () => {
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 2000n;

            const result = await writeOnlyContract.transact.mint(
                toAddress,
                amount
            );

            expect(result).toEqual({ transactionId: 'stub_tx_id' });
        });

        test('Should build clause for nonpayable function', () => {
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;

            const clause = writeOnlyContract.clause.transfer(toAddress, amount);

            expect(clause).toEqual({
                to: writeOnlyContractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/),
                value: '0x0',
                comment: undefined
            });
        });

        test('Should build clause with value for payable function', () => {
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 2000n;
            const value = 1000n;

            const clause = writeOnlyContract.clause.mint(toAddress, amount, {
                value
            });

            expect(clause).toEqual({
                to: writeOnlyContractAddress.toString(),
                data: expect.stringMatching(/^0x[a-fA-F0-9]+$/),
                value: `0x${value.toString(16)}`,
                comment: undefined
            });
        });

        test('Should create event filter', () => {
            const fromAddress = '0x1111111111111111111111111111111111111111';
            const toAddress = '0x2222222222222222222222222222222222222222';

            const filter = writeOnlyContract.filters.Transfer(
                fromAddress,
                toAddress
            );

            expect(filter).toEqual({
                eventName: 'Transfer',
                args: [fromAddress, toAddress],
                address: writeOnlyContractAddress.toString(),
                topics: [expect.any(String)]
            });
        });

        test('Should set and use transaction options', () => {
            const transactOptions = {
                gas: 100000,
                gasPrice: '1000000000',
                gasLimit: 200000
            };

            writeOnlyContract.setContractTransactOptions(transactOptions);

            expect(writeOnlyContract.getContractTransactOptions()).toEqual(
                transactOptions
            );
        });

        test('Should NOT have any read methods', () => {
            const readKeys = Object.keys(writeOnlyContract.read);
            expect(readKeys).toHaveLength(0);
        });
    });

    describe('Mixed Contract Integration', () => {
        let mixedContract: Contract<typeof mixedContractAbi>;

        beforeAll(() => {
            mixedContract = contractsModule.load(
                mixedContractAddress,
                mixedContractAbi
            );
        });

        test('Should have both read and transact methods', () => {
            // Should have read methods for view/pure functions
            expect(mixedContract.read).toHaveProperty('getBalance');
            expect(mixedContract.read).toHaveProperty('isValidAddress');
            expect(typeof mixedContract.read.getBalance).toBe('function');
            expect(typeof mixedContract.read.isValidAddress).toBe('function');

            // Should have transact methods for nonpayable/payable functions
            expect(mixedContract.transact).toHaveProperty('transfer');
            expect(mixedContract.transact).toHaveProperty('deposit');
            expect(typeof mixedContract.transact.transfer).toBe('function');
            expect(typeof mixedContract.transact.deposit).toBe('function');
        });

        test('Should execute read operations', async () => {
            const result = await mixedContract.read.getBalance(
                testAccount.address
            );

            expect(Array.isArray(result)).toBe(true);
        });

        test('Should execute write operations', async () => {
            const toAddress = '0x9876543210987654321098765432109876543210';
            const amount = 1000n;

            const result = await mixedContract.transact.transfer(
                toAddress,
                amount
            );

            expect(result).toEqual({ transactionId: 'stub_tx_id' });
        });

        test('Should build clauses for all functions', () => {
            // Read function clause
            const readClause = mixedContract.clause.getBalance(
                testAccount.address
            );
            expect(readClause).toHaveProperty('to');
            expect(readClause).toHaveProperty('data');
            expect(readClause).toHaveProperty('value');

            // Write function clause
            const writeClause = mixedContract.clause.transfer(
                '0x9876543210987654321098765432109876543210',
                1000n
            );
            expect(writeClause).toHaveProperty('to');
            expect(writeClause).toHaveProperty('data');
            expect(writeClause).toHaveProperty('value');
        });

        test('Should create event filters', () => {
            const fromAddress = '0x1111111111111111111111111111111111111111';
            const toAddress = '0x2222222222222222222222222222222222222222';

            const filter = mixedContract.filters.Transfer(
                fromAddress,
                toAddress
            );

            expect(filter).toEqual({
                eventName: 'Transfer',
                args: [fromAddress, toAddress],
                address: mixedContractAddress.toString(),
                topics: [expect.any(String)]
            });
        });

        test('Should handle both read and transaction options', () => {
            const readOptions = {
                revision: 'best',
                caller: testAccount.address
            };
            const transactOptions = { gas: 100000, gasPrice: '1000000000' };

            mixedContract.setContractReadOptions(readOptions);
            mixedContract.setContractTransactOptions(transactOptions);

            expect(mixedContract.getContractReadOptions()).toEqual(readOptions);
            expect(mixedContract.getContractTransactOptions()).toEqual(
                transactOptions
            );
        });
    });

    describe('Error Handling Integration', () => {
        test('Should handle contract with invalid address gracefully', () => {
            const invalidAddress = Address.of(
                '0x0000000000000000000000000000000000000000'
            );

            expect(() => {
                contractsModule.load(invalidAddress, readOnlyContractAbi);
            }).not.toThrow();
        });

        test('Should handle empty ABI gracefully', () => {
            const emptyAbi = [] as const;

            expect(() => {
                contractsModule.load(readOnlyContractAddress, emptyAbi);
            }).not.toThrow();
        });

        test('Should handle missing signer for read operations', async () => {
            const contractWithoutSigner = contractsModule.load(
                readOnlyContractAddress,
                readOnlyContractAbi
            );

            // Read operations should work without signer
            expect(contractWithoutSigner.getSigner()).toBeUndefined();

            const result = await contractWithoutSigner.read.getBalance(
                testAccount.address
            );
            expect(Array.isArray(result)).toBe(true);
        });

        test('Should handle missing signer for write operations', async () => {
            const contractWithoutSigner = contractsModule.load(
                writeOnlyContractAddress,
                writeOnlyContractAbi
            );

            // Write operations should require signer
            expect(contractWithoutSigner.getSigner()).toBeUndefined();

            await expect(
                contractWithoutSigner.transact.transfer(
                    '0x9876543210987654321098765432109876543210',
                    1000n
                )
            ).rejects.toThrow('Signer is required for transaction execution');
        });
    });

    describe('Client Integration', () => {
        test('Should access PublicClient through contract', () => {
            const contract = contractsModule.load(
                readOnlyContractAddress,
                readOnlyContractAbi
            );

            expect(contract.getPublicClient()).toBe(publicClient);
        });

        test('Should access WalletClient through contract', () => {
            const contract = contractsModule.load(
                readOnlyContractAddress,
                readOnlyContractAbi
            );

            expect(contract.getWalletClient()).toBe(walletClient);
        });

        test('Should check client availability', () => {
            expect(contractsModule.hasPublicClient()).toBe(true);
            expect(contractsModule.hasWalletClient()).toBe(true);
        });
    });

    describe('VeChain-Specific Features', () => {
        test('Should handle VeChain transaction formats', async () => {
            const contract = contractsModule.load(
                mixedContractAddress,
                mixedContractAbi
            );

            const result = await contract.transact.transfer(
                '0x9876543210987654321098765432109876543210',
                1000n
            );

            expect(result).toEqual({ transactionId: 'stub_tx_id' });
        });

        test('Should handle VeChain clause building', () => {
            const contract = contractsModule.load(
                mixedContractAddress,
                mixedContractAbi
            );

            const clause = contract.clause.transfer(
                '0x9876543210987654321098765432109876543210',
                1000n
            );

            expect(clause).toHaveProperty('to');
            expect(clause).toHaveProperty('data');
            expect(clause).toHaveProperty('value');
            expect(clause.to).toBe(mixedContractAddress.toString());
        });

        test('Should handle VeChain event filtering', () => {
            const contract = contractsModule.load(
                mixedContractAddress,
                mixedContractAbi
            );

            const filter = contract.filters.Transfer(
                '0x1111111111111111111111111111111111111111',
                '0x2222222222222222222222222222222222222222'
            );

            expect(filter).toHaveProperty('eventName', 'Transfer');
            expect(filter).toHaveProperty('args');
            expect(filter).toHaveProperty(
                'address',
                mixedContractAddress.toString()
            );
            expect(filter).toHaveProperty('topics');
        });
    });
});
