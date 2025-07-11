import { type TransactionClause } from '@vechain/sdk-core';
import { Address, HexUInt } from '@vechain/sdk-core';
import { THOR_SOLO_ACCOUNTS_TO_SEED } from '@vechain/sdk-solo-setup';
import { type TransactionRequestInput } from '../../../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * This interface clones the `TestCaseTypedDataDomain` interface in
 * [test-wallet.ts](https://github.com/ethers-io/ethers.js/blob/main/src.ts/_tests/test-wallet.ts)
 * to implement [ethers](https://github.com/ethers-io/ethers.js) compatibility tests.
 */
interface TestCaseTypedDataDomain {
    name?: string;
    version?: string;
    chainId?: number;
    verifyingContract?: string;
    salt?: string;
}

/**
 * This interface clones the `TestCaseTypedDataType` interface in
 * [test-wallet.ts](https://github.com/ethers-io/ethers.js/blob/main/src.ts/_tests/test-wallet.ts)
 * to implement [ethers](https://github.com/ethers-io/ethers.js) compatibility tests.
 */
interface TestCaseTypedDataType {
    name: string;
    type: string;
}

/**
 * This interface clones the `TestCaseTypedData` interface in
 * [test-wallet.ts](https://github.com/ethers-io/ethers.js/blob/main/src.ts/_tests/test-wallet.ts)
 * to implement [ethers](https://github.com/ethers-io/ethers.js) compatibility tests.
 */
interface TestCaseTypedData {
    name: string;

    domain: TestCaseTypedDataDomain;
    primaryType: string;
    types: Record<string, TestCaseTypedDataType[]>;
    data: Record<string, unknown>;

    encoded: string;
    digest: string;

    privateKey: string;
    signature: string;
}

// This is private for EIP-191 unit test cases only. Dummy key`'
const EIP191_PRIVATE_KEY =
    '0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf3';

// Used to challenge consistent test encoding.
const EIP191_MESSAGE = 'Hello world! - こんにちは世界 - 👋🗺️!';

// This is private for EIP-712 unit test cases only. Dummy key`'
const EIP712_PRIVATE_KEY =
    '0xc85ef7d79691fe79573b1a7064c19c1a9819ebdbd1faaab1a8ec92344438aaf4';

// This is private for EIP-712 unit test case only. Dummy address.
const EIP712_CONTRACT = '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC';

// This is private for EIP-712 unit test case only. Dummy address.
const EIP712_FROM = '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826';

// This is private for EIP-712 unit test case only. Dummy address.
const EIP712_TO = '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB';

const eip712TestCases = {
    invalid: {
        name: 'EIP712 example',
        domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: EIP712_CONTRACT
        },
        primaryType: 'Mail',
        types: {
            Mail: [
                {
                    name: 'from',
                    type: 'invalid'
                }
            ]
        },
        data: {
            from: {
                name: 'Cow',
                wallet: EIP712_FROM
            },
            to: {
                name: 'Bob',
                wallet: EIP712_TO
            },
            contents: 'Hello, Bob!'
        },
        encoded: 'ignored',
        digest: 'ignored',
        privateKey: EIP712_PRIVATE_KEY,
        signature: 'ignored'
    } satisfies TestCaseTypedData,
    valid: {
        name: 'EIP712 example',
        domain: {
            name: 'Ether Mail',
            version: '1',
            chainId: 1,
            verifyingContract: EIP712_CONTRACT
        },
        primaryType: 'Mail',
        types: {
            Person: [
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'wallet',
                    type: 'address'
                }
            ],
            Mail: [
                {
                    name: 'from',
                    type: 'Person'
                },
                {
                    name: 'to',
                    type: 'Person'
                },
                {
                    name: 'contents',
                    type: 'string'
                }
            ]
        },
        data: {
            from: {
                name: 'Cow',
                wallet: EIP712_FROM
            },
            to: {
                name: 'Bob',
                wallet: EIP712_TO
            },
            contents: 'Hello, Bob!'
        },
        encoded:
            '0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2fc71e5fa27ff56c350aa531bc129ebdf613b772b6604664f5d8dbe21b85eb0c8cd54f074a4af31b4411ff6a60c9719dbd559c221c8ac3492d9d872b041d703d1b5aadf3154a261abdd9086fc627b61efca26ae5702701d05cd2305f7c52a2fc8',
        digest: '0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2',
        privateKey: EIP712_PRIVATE_KEY,
        signature:
            '0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c'
    } satisfies TestCaseTypedData
};

/**
 * Account to populate call test cases
 */
const populateCallTestCasesAccount = THOR_SOLO_ACCOUNTS_TO_SEED[0];
const testAccount = THOR_SOLO_ACCOUNTS_TO_SEED[1];

/**
 * Test cases for populateCall function
 */
const populateCallTestCases = {
    /**
     * Positive test cases
     */
    positive: [
        // Already defined clauses
        {
            description:
                'Should populate call with clauses already defined BUT empty',
            transactionToPopulate: {
                clauses: []
            } satisfies TransactionRequestInput,
            expected: {
                clauses: [],
                from: Address.checksum(
                    HexUInt.of(populateCallTestCasesAccount.address)
                ),
                to: null
            }
        },
        {
            description: 'Should populate call with clauses already defined',
            transactionToPopulate: {
                clauses: [
                    {
                        to: '0x',
                        value: 0,
                        data: '0x'
                    }
                ] as TransactionClause[]
            } satisfies TransactionRequestInput,
            expected: {
                clauses: [
                    {
                        to: '0x',
                        value: 0,
                        data: '0x'
                    }
                ] as TransactionClause[],
                data: '0x',
                from: Address.checksum(
                    HexUInt.of(populateCallTestCasesAccount.address)
                ),
                to: '0x',
                value: 0
            }
        },

        // No clauses defined

        // tx.from and tx.to undefined
        {
            description:
                'Should use signer address as from address if not defined AND to address as null if to is not defined',
            transactionToPopulate: {} satisfies TransactionRequestInput,
            expected: {
                from: Address.checksum(
                    HexUInt.of(populateCallTestCasesAccount.address)
                ),
                to: null
            } satisfies TransactionRequestInput
        },

        // tx.from defined AND tx.to undefined
        {
            description: 'Should set from address from tx.from',
            transactionToPopulate: {
                from: Address.checksum(
                    HexUInt.of(populateCallTestCasesAccount.address)
                )
            } satisfies TransactionRequestInput,
            expected: {
                from: Address.checksum(
                    HexUInt.of(populateCallTestCasesAccount.address)
                ),
                to: null
            } satisfies TransactionRequestInput
        },

        // tx.from undefined AND tx.to defined
        {
            description:
                'Should set from address from signer and have tx.to defined',
            transactionToPopulate: {
                to: Address.checksum(HexUInt.of(testAccount.address))
            } satisfies TransactionRequestInput,
            expected: {
                from: Address.checksum(
                    HexUInt.of(populateCallTestCasesAccount.address)
                ),
                to: Address.checksum(HexUInt.of(testAccount.address))
            } satisfies TransactionRequestInput
        }
    ],

    /**
     * Negative test cases
     */
    negative: [
        // No clauses defined

        // tx.from defined BUT invalid
        {
            description:
                'Should NOT set from address from tx.from because different form signer address',
            transactionToPopulate: {
                from: '0x0000000000000000000000000000000000000000'
            } satisfies TransactionRequestInput,
            expectedError: InvalidDataType
        }
    ]
};

export {
    EIP191_MESSAGE,
    EIP191_PRIVATE_KEY,
    eip712TestCases,
    populateCallTestCases,
    populateCallTestCasesAccount
};
