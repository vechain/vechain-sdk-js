import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Retrieves the details of a transaction.
const transactionDetails =
    await thorestTestnetClient.transactions.getTransaction(
        '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
    );
expect(transactionDetails).toEqual({
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
});

// Retrieves the receipt of a transaction.
const transactionReceipt =
    await thorestTestnetClient.transactions.getTransactionReceipt(
        '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
    );
expect(transactionReceipt).toEqual({
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
                    recipient: '0x5d57f07dfeb8c224121433d5b1b401c82bd88f3d',
                    amount: '0x2ea11e32ad50000'
                }
            ]
        }
    ]
});
