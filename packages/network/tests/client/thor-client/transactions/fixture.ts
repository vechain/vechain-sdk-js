import { InvalidDataTypeError } from '@vechain-sdk/errors';
import { TEST_ACCOUNTS } from '../../../fixture';

/**
 * Transaction details function fixture.
 */
const transactionDetails = {
    correct: [
        {
            testName:
                'Should be able to retrieve a transaction - NO RAW FORMAT',
            transaction: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                raw: false,
                pending: false
            },
            expected: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                chainTag: 39,
                blockRef: '0x010284a0b704e751',
                expiration: 2000,
                clauses: [
                    {
                        to: '0x5d57f07dfeb8c224121433d5b1b401c82bd88f3d',
                        value: '0x2ea11e32ad50000',
                        data: '0x'
                    }
                ],
                gasPriceCoef: 0,
                gas: 41192,
                origin: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af',
                delegator: null,
                nonce: '0x76eed751cef0e52d',
                dependsOn: null,
                size: 130,
                meta: {
                    blockID:
                        '0x010284a1fea0635a2e47dd21f8a1761406df1013e5f4af79e311d8a27373980d',
                    blockNumber: 16942241,
                    blockTimestamp: 1699453780
                }
            }
        },
        {
            testName: 'Should be able to retrieve a transaction - RAW FORMAT',
            transaction: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                raw: true,
                pending: true
            },
            expected: {
                raw: '0xf8802788010284a0b704e7518207d0e0df945d57f07dfeb8c224121433d5b1b401c82bd88f3d8802ea11e32ad50000808082a0e8808876eed751cef0e52dc0b841b2bb1ba31c7b78383bf7e01097038d26e6f1c685bdc73fce981f574eb7bb3abd6e59660e522c4870f1d033c0f82420448f44139e0fb2254a36d98ed387964c3c00',
                meta: {
                    blockID:
                        '0x010284a1fea0635a2e47dd21f8a1761406df1013e5f4af79e311d8a27373980d',
                    blockNumber: 16942241,
                    blockTimestamp: 1699453780
                }
            }
        }
    ],
    errors: [
        {
            testName: 'Should throw error when invalid transaction id is given',
            transaction: {
                id: 'WRONG_ID'
            },
            expected: InvalidDataTypeError
        },
        {
            testName: 'Should throw error when invalid head of block is given',
            transaction: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                raw: false,
                pending: false,
                head: 'WRONG_HEAD'
            },
            expected: InvalidDataTypeError
        }
    ]
};

/**
 * Transaction receipts function fixture.
 */
const transactionReceipts = {
    correct: [
        {
            testName: 'Should be able to retrieve a transaction receipt',
            transaction: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
            },
            expected: {
                gasUsed: 21000,
                gasPayer: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af',
                paid: '0x2ea11e32ad50000',
                reward: '0xdfd22a8cd98000',
                reverted: false,
                meta: {
                    blockID:
                        '0x010284a1fea0635a2e47dd21f8a1761406df1013e5f4af79e311d8a27373980d',
                    blockNumber: 16942241,
                    blockTimestamp: 1699453780,
                    txID: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                    txOrigin: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af'
                },
                outputs: [
                    {
                        contractAddress: null,
                        events: [],
                        transfers: [
                            {
                                sender: '0x2d4ed6b8abd00bc2ef0bdb2258a946c214d9d0af',
                                recipient:
                                    '0x5d57f07dfeb8c224121433d5b1b401c82bd88f3d',
                                amount: '0x2ea11e32ad50000'
                            }
                        ]
                    }
                ]
            }
        }
    ],
    errors: [
        {
            testName: 'Should throw error when invalid transaction id is given',
            transaction: {
                id: 'WRONG_ID'
            },
            expected: InvalidDataTypeError
        },
        {
            testName: 'Should throw error when invalid head of block is given',
            transaction: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                head: 'WRONG_HEAD'
            },
            expected: InvalidDataTypeError
        },
        {
            testName:
                'Should throw error when invalid head of block hex string length is given',
            transaction: {
                id: '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb',
                head: '0x1234'
            },
            expected: InvalidDataTypeError
        }
    ]
};

/**
 * Send transaction function errors fixture.
 */
const sendTransactionErrors = {
    correct: [
        {
            testName: 'Should be able to send a transaction with 1 clause',
            transaction: {
                clauses: [
                    {
                        to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        value: 1000000,
                        data: '0x'
                    }
                ]
            }
        },
        {
            testName: 'Should be able to send a transaction with more clauses',
            transaction: {
                clauses: [
                    {
                        to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                            .address,
                        value: 1000000,
                        data: '0x'
                    },
                    {
                        to: TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                        value: 1000000,
                        data: '0x'
                    }
                ]
            }
        }
    ],
    errors: [
        {
            testName:
                'Should throw error when invalid encoded raw transaction hex string is given',
            transaction: {
                raw: 'INVALID_HEX_STRING'
            },
            expected: InvalidDataTypeError
        },
        {
            testName:
                'Should throw error when invalid encoded raw transaction is given',
            transaction: {
                raw: '0x123456789abcdef'
            },
            expected: InvalidDataTypeError
        }
    ]
};

export { transactionDetails, transactionReceipts, sendTransactionErrors };
