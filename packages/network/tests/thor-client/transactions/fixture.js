"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForTransactionTestCases = exports.transferTransactionBodyValueAsNumber = exports.transferTransactionBody = exports.transfer1VTHOClause = exports.transactionNonces = exports.invalidWaitForTransactionTestCases = exports.getRevertReasonTestCasesFixture = exports.expectedReceipt = exports.buildTransactionBodyClausesTestCases = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const test_utils_1 = require("../../test-utils");
/**
 * Some random transaction nonces to use into tests
 */
const transactionNonces = {
    waitForTransactionTestCases: [10000000, 10000001, 10000002, 10000003],
    sendTransactionWithANumberAsValueInTransactionBody: [10000004],
    invalidWaitForTransactionTestCases: [10000005],
    shouldThrowErrorIfTransactionIsntSigned: [10000006]
};
exports.transactionNonces = transactionNonces;
/**
 * Clause to transfer 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transfer1VTHOClause = {
    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
    value: '0',
    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
        .encodeFunctionInput('transfer', [
        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
        sdk_core_1.Units.parseEther('1').bi
    ])
        .toString()
};
exports.transfer1VTHOClause = transfer1VTHOClause;
/**
 * Clause to transfer 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transfer1VTHOClauseWithValueAsANumber = {
    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
    value: 0,
    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
        .encodeFunctionInput('transfer', [
        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
        sdk_core_1.Units.parseEther('1').bi
    ])
        .toString()
};
/**
 * transaction body that transfers 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transferTransactionBody = {
    clauses: [transfer1VTHOClause],
    expiration: 1000,
    gasPriceCoef: 128,
    dependsOn: null
};
exports.transferTransactionBody = transferTransactionBody;
/**
 * transaction body that transfers 1 VTHO to TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
 */
const transferTransactionBodyValueAsNumber = {
    clauses: [transfer1VTHOClauseWithValueAsANumber],
    expiration: 1000,
    gasPriceCoef: 128,
    dependsOn: null
};
exports.transferTransactionBodyValueAsNumber = transferTransactionBodyValueAsNumber;
/**
 * Expected transaction receipt values.
 * Note that this object is not a valid `TransactionReceipt` object.
 */
const expectedReceipt = {
    events: [],
    gasPayer: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    gasUsed: 36518,
    outputs: [
        {
            contractAddress: null,
            events: [
                {
                    address: '0x0000000000000000000000000000456e65726779',
                    data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x0000000000000000000000002669514f9fe96bc7301177ba774d3da8a06cace4',
                        '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
                    ]
                }
            ],
            transfers: []
        }
    ],
    reverted: false
};
exports.expectedReceipt = expectedReceipt;
/**
 * waitForTransaction test cases that should return a transaction receipt
 */
const waitForTransactionTestCases = [
    {
        description: 'Should wait for transaction without timeout and return TransactionReceipt',
        options: {
            timeoutMs: undefined,
            intervalMs: undefined,
            nonce: transactionNonces.waitForTransactionTestCases[0]
        }
    },
    {
        description: 'Should wait for transaction with timeout and return TransactionReceipt',
        options: {
            timeoutMs: 10000,
            intervalMs: undefined,
            nonce: transactionNonces.waitForTransactionTestCases[1]
        }
    },
    {
        description: 'Should wait for transaction with intervalMs TransactionReceipt',
        options: {
            timeoutMs: undefined,
            intervalMs: 100,
            nonce: transactionNonces.waitForTransactionTestCases[2]
        }
    },
    {
        description: 'Should wait for transaction with intervalMs & timeoutMs and return TransactionReceipt',
        options: {
            timeoutMs: 10000,
            intervalMs: 100,
            nonce: transactionNonces.waitForTransactionTestCases[3]
        }
    }
];
exports.waitForTransactionTestCases = waitForTransactionTestCases;
/**
 * waitForTransaction test cases that should not return a transaction receipt. Instead, should return null.
 */
const invalidWaitForTransactionTestCases = [
    {
        description: 'Should return null when timeoutMs is too low and tx cannot be included in time',
        options: {
            timeoutMs: 1,
            intervalMs: undefined,
            nonce: transactionNonces.invalidWaitForTransactionTestCases[0],
            dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f'
        }
    }
];
exports.invalidWaitForTransactionTestCases = invalidWaitForTransactionTestCases;
/**
 * buildTransactionBody test cases
 */
const buildTransactionBodyClausesTestCases = [
    {
        description: 'Should build transaction body that transfers 1 VTHO',
        clauses: [transfer1VTHOClause],
        options: { gasPriceCoef: 0 },
        expected: {
            solo: {
                chainTag: (0, test_utils_1.getSoloChainTag)(),
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    }
                ],
                dependsOn: null,
                expiration: 32,
                gas: 51518,
                gasPriceCoef: 0,
                reserved: undefined
            },
            testnet: {
                chainTag: 39,
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    }
                ],
                dependsOn: null,
                expiration: 32,
                gas: 39263,
                gasPriceCoef: 0,
                reserved: undefined
            }
        }
    },
    {
        description: 'Should build transaction that executes many clauses and all options',
        clauses: [
            transfer1VTHOClause,
            transfer1VTHOClause,
            {
                to: fixture_1.TESTING_CONTRACT_ADDRESS,
                value: '0',
                data: sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI)
                    .encodeFunctionInput('testAssertError', [0] // Any number !== 0 will cause Panic error
                )
                    .toString()
            },
            {
                to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: sdk_core_1.Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPriceCoef: 255,
            expiration: 1000,
            isDelegated: true,
            dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f' // Any valid tx id
        },
        expected: {
            solo: {
                chainTag: (0, test_utils_1.getSoloChainTag)(),
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xc7bce69d0000000000000000000000000000000000000000000000000000000000000000',
                        to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
                        value: '0'
                    },
                    {
                        data: '0x',
                        to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                        value: '1000000000000000000'
                    }
                ],
                dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f',
                expiration: 1000,
                gas: 115768,
                gasPriceCoef: 255,
                reserved: { features: 1 }
            },
            testnet: {
                chainTag: 39,
                clauses: [
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000',
                        to: '0x0000000000000000000000000000456e65726779',
                        value: '0'
                    },
                    {
                        data: '0xc7bce69d0000000000000000000000000000000000000000000000000000000000000000',
                        to: fixture_1.configData.TESTING_CONTRACT_ADDRESS,
                        value: '0'
                    },
                    {
                        data: '0x',
                        to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                        value: '1000000000000000000'
                    }
                ],
                dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f',
                expiration: 1000,
                gas: 89855,
                gasPriceCoef: 255,
                reserved: { features: 1 }
            }
        }
    },
    {
        description: 'Should resolve names into addresses in all clauses',
        clauses: [
            {
                to: 'vtho.test-sdk.vet',
                value: '0',
                data: '0x'
            },
            {
                to: 'params.test-sdk.vet',
                value: sdk_core_1.Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPriceCoef: 255,
            expiration: 1000,
            isDelegated: true,
            dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f' // Any valid tx id
        },
        expected: {
            testnet: {
                chainTag: 39,
                clauses: [
                    {
                        data: '0x',
                        to: '0x0000000000000000000000000000456E65726779',
                        value: '0'
                    },
                    {
                        data: '0x',
                        to: '0x0000000000000000000000000000506172616D73',
                        value: '1000000000000000000'
                    }
                ],
                dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f',
                expiration: 1000,
                gas: 52046,
                gasPriceCoef: 255,
                reserved: { features: 1 }
            }
        }
    },
    {
        description: 'Should not modify "to" part of clauses when no name is used',
        clauses: [
            {
                to: '0x0000000000000000000000000000456E65726779',
                value: '0',
                data: '0x'
            },
            {
                to: null,
                value: '0',
                data: '0x'
            },
            {
                to: 'vtho.test-sdk.vet',
                value: '0',
                data: '0x'
            }
        ],
        options: {
            gasPriceCoef: 255,
            expiration: 1000,
            isDelegated: true,
            dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f' // Any valid tx id
        },
        expected: {
            testnet: {
                chainTag: 39,
                clauses: [
                    {
                        data: '0x',
                        to: '0x0000000000000000000000000000456E65726779',
                        value: '0'
                    },
                    {
                        to: null,
                        data: '0x',
                        value: '0'
                    },
                    {
                        data: '0x',
                        to: '0x0000000000000000000000000000456E65726779',
                        value: '0'
                    }
                ],
                dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f',
                expiration: 1000,
                gas: 100046,
                gasPriceCoef: 255,
                reserved: { features: 1 }
            }
        }
    }
];
exports.buildTransactionBodyClausesTestCases = buildTransactionBodyClausesTestCases;
/**
 * Fixture for getRevertReason method
 */
const getRevertReasonTestCasesFixture = [
    {
        description: 'Should be able to get Error message from reverted transaction',
        revertedTransactionHash: '0xf464a7dbdf0c89452261dc00d6cb31f1ce87aee2212c30c8d1eceea8ee31528e',
        expected: 'SUBMISSION_ALREADY_MADE'
    },
    {
        description: 'Should be able to get Panic message code from reverted transaction',
        revertedTransactionHash: '0x0a5177fb83346bb6ff7ca8408889f0c99f44b2b1b5c8bf6f0eb53c4b2e81d98d',
        expected: 'Panic(0x12)'
    },
    {
        description: 'Should return empty string if reverted transaction has no revert reason',
        revertedTransactionHash: '0x6417ee27afe19acc9765eb35e3d05fcca7a0b98d3a321855acaa981696c816a1',
        expected: ''
    },
    {
        description: 'Should return null if transaction IS NOT reverted',
        revertedTransactionHash: '0xcc9ce45f0c7c0d95e0c1afbd4c0c5cee01876968c8b610e0f02d7ff8d6344682',
        expected: null
    },
    {
        description: 'Should return null if transaction IS NOT found',
        revertedTransactionHash: '0x00000000000000000000000d4c0c5cee01876960000000000000000000000000',
        expected: null
    },
    {
        description: 'Should be able to read solidity errors',
        revertedTransactionHash: '0x8f443452163e8fbd17ea9b541baba5a633c25f7f28e1523f18ddbae16440d6e5',
        expected: '0 input is not allowed',
        errorFragment: 'error SimpleSolidityError(string message)'
    }
];
exports.getRevertReasonTestCasesFixture = getRevertReasonTestCasesFixture;
