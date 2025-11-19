"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidEstimateGasTestCases = exports.estimateGasTestCases = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const fixture_2 = require("../transactions/fixture");
/**
 * Test cases for `estimateGas` method
 */
const estimateGasTestCases = {
    revert: [
        {
            description: 'Should estimate gas cost of a transaction that reverts with 1 clause',
            clauses: [
                {
                    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
                        .encodeFunctionInput('transfer', [
                        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        sdk_core_1.Units.parseEther('1000000000').bi
                    ])
                        .toString()
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 39455,
                vmErrors: ['execution reverted']
            }
        },
        {
            description: 'Should estimate gas cost of a transaction that reverts with 2 clauses where both revert',
            clauses: [
                {
                    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
                        .encodeFunctionInput('transfer', [
                        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        sdk_core_1.Units.parseEther('1000000000').bi
                    ])
                        .toString()
                },
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1000000000').toString(),
                    data: '0x'
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['builtin: insufficient balance'],
                reverted: true,
                totalGas: 55455,
                vmErrors: ['execution reverted']
            }
        },
        {
            description: 'Should estimate gas cost of a transaction that reverts with 2 clauses where only second reverts',
            clauses: [
                {
                    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
                        .encodeFunctionInput('transfer', [
                        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        sdk_core_1.Units.parseEther('1').bi
                    ])
                        .toString()
                },
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1000000000').toString(),
                    data: '0x'
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['', ''],
                reverted: true,
                totalGas: 67518,
                vmErrors: ['', 'insufficient balance for transfer']
            }
        },
        {
            description: 'Should estimate gas cost of a transaction that reverts with 3 clauses where only last reverts',
            clauses: [
                {
                    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
                        .encodeFunctionInput('transfer', [
                        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        sdk_core_1.Units.parseEther('1').bi
                    ])
                        .toString()
                },
                {
                    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
                        .encodeFunctionInput('transfer', [
                        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        sdk_core_1.Units.parseEther('1').bi
                    ])
                        .toString()
                },
                {
                    to: src_1.BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(src_1.BUILT_IN_CONTRACTS.ENERGY_ABI)
                        .encodeFunctionInput('transfer', [
                        fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        sdk_core_1.Units.parseEther('1000000000').bi
                    ])
                        .toString()
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['', '', 'builtin: insufficient balance'],
                reverted: true,
                totalGas: 102491,
                vmErrors: ['', '', 'execution reverted']
            }
        },
        {
            description: 'Should estimate gas cost of a transaction that reverts with a Panic(uint256) error',
            clauses: [
                {
                    to: fixture_1.TESTING_CONTRACT_ADDRESS,
                    value: '0',
                    data: sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI)
                        .encodeFunctionInput('testAssertError', [1] // Any number !== 0 will cause Panic error
                    )
                        .toString()
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                revertReasons: ['Panic(0x01)'], // 0x01: If you call assert with an argument that evaluates to false.
                reverted: true,
                totalGas: 36829,
                vmErrors: ['execution reverted']
            }
        },
        {
            description: 'Should estimate gas cost of a transaction that reverts due to offered gas below the gas required',
            clauses: [fixture_2.transfer1VTHOClause],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gas: 1000
            },
            expected: {
                reverted: true,
                totalGas: 39192,
                revertReasons: [''],
                vmErrors: ['out of gas']
            }
        }
    ],
    success: [
        {
            description: 'Should estimate gas cost of a transaction that transfers 1 VTHO',
            clauses: [fixture_2.transfer1VTHOClause],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                reverted: false,
                totalGas: 51518,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description: 'Should estimate gas cost of a transaction that executes many clauses',
            clauses: [
                fixture_2.transfer1VTHOClause,
                fixture_2.transfer1VTHOClause,
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
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                reverted: false,
                totalGas: 115768,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description: 'Should estimate gas cost of a transaction with delegation context',
            clauses: [fixture_2.transfer1VTHOClause],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gasPayer: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
            },
            expected: {
                reverted: false,
                totalGas: 51518,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description: 'Should estimate gas cost of a transaction sending VET',
            clauses: [
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1').toString(),
                    data: '0x'
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {},
            expected: {
                reverted: false,
                totalGas: 21000,
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description: 'Should estimate gas cost of a transaction sending VET with 2 clauses',
            clauses: [
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1').toString(),
                    data: '0x'
                },
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1').toString(),
                    data: '0x'
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gasPadding: 0.2 // 20%
            },
            expected: {
                reverted: false,
                totalGas: 44400, // 37000 + 20%
                revertReasons: [],
                vmErrors: []
            }
        },
        {
            description: 'Should estimate gas cost correct and have an integer as gas, when gasPadding should add a decimal',
            clauses: [
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1').toString(),
                    data: '0x'
                },
                {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1').toString(),
                    data: '0x'
                }
            ],
            caller: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address,
            options: {
                gasPadding: 0.113458 // 11.3458%
            },
            expected: {
                reverted: false,
                totalGas: 41198, // 37000 + 11.3458% = 41197.946
                revertReasons: [],
                vmErrors: []
            }
        }
    ]
};
exports.estimateGasTestCases = estimateGasTestCases;
/**
 * Test cases where the estimation throws an error
 */
const invalidEstimateGasTestCases = [
    {
        clauses: [],
        options: {},
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        clauses: [
            {
                to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: sdk_core_1.Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPadding: 1.1
        },
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        clauses: [
            {
                to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: sdk_core_1.Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPadding: 0
        },
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        clauses: [
            {
                to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                value: sdk_core_1.Units.parseEther('1').toString(),
                data: '0x'
            }
        ],
        options: {
            gasPadding: -1
        },
        expectedError: sdk_errors_1.InvalidDataType
    }
];
exports.invalidEstimateGasTestCases = invalidEstimateGasTestCases;
