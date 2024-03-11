import { generateRandomValidAddress } from '../../../../core/tests/fixture';
import { vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { TESTING_CONTRACT_ADDRESS } from '../../fixture';
import WebSocket from 'ws';

/**
 * random address for `from` parameter
 */
const fromRandomAddress = generateRandomValidAddress();

/**
 * random address for `to` parameter
 */
const toRandomAddress = generateRandomValidAddress();

/**
 * `value` random BigInt
 */
const randomBigInt = BigInt(Math.floor(Math.random() * 1000));

/**
 * Test cases for the getEventSubscriptionUrl function
 */
const getEventSubscriptionUrlTestCases = [
    {
        event: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'from',
                    type: 'address'
                },
                {
                    indexed: true,
                    name: 'to',
                    type: 'address'
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256'
                }
            ],
            name: 'Transfer',
            type: 'event'
        },
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: vechain_sdk_core_ethers.EventFragment.from({
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    name: 'from',
                    type: 'address'
                },
                {
                    indexed: true,
                    name: 'to',
                    type: 'address'
                },
                {
                    indexed: false,
                    name: 'value',
                    type: 'uint256'
                }
            ],
            name: 'Transfer',
            type: 'event'
        }),
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed, address indexed, uint256)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [fromRandomAddress], // Missing `to` parameter
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [null, toRandomAddress], // Missing `from` parameter
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t2=0x000000000000000000000000${toRandomAddress.slice(
            2
        )}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [], // Missing `from` and `to` parameters
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: undefined,
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`
    },
    {
        event: 'event Approval(address indexed owner, address indexed spender, uint256 value)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        valuesToEncode: [fromRandomAddress, toRandomAddress, randomBigInt],
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(
            2
        )}&t3=${vechain_sdk_core_ethers.zeroPadValue(
            vechain_sdk_core_ethers.hexlify(
                vechain_sdk_core_ethers.toBeHex(randomBigInt)
            ),
            32
        )}`
    },
    // WITH OPTIONS
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [null, toRandomAddress], // Missing `from` parameter
        options: {
            address: TESTING_CONTRACT_ADDRESS
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?addr=${TESTING_CONTRACT_ADDRESS}&t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t2=0x000000000000000000000000${toRandomAddress.slice(
            2
        )}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 indexed value)',
        valuesToEncode: [fromRandomAddress, null, randomBigInt], // Missing `to` parameter
        options: {
            address: TESTING_CONTRACT_ADDRESS
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?addr=${TESTING_CONTRACT_ADDRESS}&t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t3=${vechain_sdk_core_ethers.zeroPadValue(
            vechain_sdk_core_ethers.hexlify(
                vechain_sdk_core_ethers.toBeHex(randomBigInt)
            ),
            32
        )}`
    },
    {
        event: 'event Swap(address indexed sender,uint amount0In,uint amount1In,uint amount0Out,uint amount1Out,address indexed to)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {
            address: TESTING_CONTRACT_ADDRESS
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?addr=${TESTING_CONTRACT_ADDRESS}&t0=0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    }
];

/**
 * Test cases for the getBlockSubscriptionUrl function
 */
const getBlockSubscriptionUrlTestCases = [
    {
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/block`
    }
];

/**
 * Test cases for the getLegacyBeatSubscriptionUrl function
 */
const getLegacyBeatSubscriptionUrlTestCases = [
    {
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/beat`
    }
];

/**
 * Test cases for the getBeatSubscriptionUrl function
 */
const getBeatSubscriptionUrlTestCases = [
    {
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/beat2`
    }
];

/**
 * Test cases for the getNewTransactionsSubscriptionUrl function
 */
const getNewTransactionsSubscriptionUrlTestCases = [
    {
        expectedURL: `wss://testnet.vechain.org/subscriptions/txpool`
    }
];

const getVETtransfersSubscriptionUrlTestCases = [
    {
        options: {},
        expectedURL: `wss://testnet.vechain.org/subscriptions/transfer`
    },
    {
        options: {
            signerAddress: fromRandomAddress
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/transfer?txOrigin=${fromRandomAddress}`
    },

    {
        options: {
            signerAddress: fromRandomAddress,
            sender: fromRandomAddress
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/transfer?txOrigin=${fromRandomAddress}&sender=${fromRandomAddress}`
    },
    {
        options: {
            recipient: toRandomAddress
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/transfer?recipient=${toRandomAddress}`
    }
];

/**
 * Test if the websocket connection is valid
 *
 * @param url - The websocket URL to test
 *
 * @returns A promise that resolves to true if the connection is valid, false otherwise.
 */
async function testWebSocketConnection(url: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        const ws = new WebSocket(url);

        ws.on('open', () => {
            ws.close();
            resolve(true);
        });

        ws.on('error', (error: Error) => {
            reject(error);
        });

        ws.on('unexpected-response', (request, response) => {
            reject(
                new Error(
                    `Unexpected response: ${JSON.stringify(
                        response.headers
                    )}\nrequest: ${JSON.stringify(request.getHeaders())}`
                )
            );
        });
    });
}

export {
    getEventSubscriptionUrlTestCases,
    getBlockSubscriptionUrlTestCases,
    getLegacyBeatSubscriptionUrlTestCases,
    getBeatSubscriptionUrlTestCases,
    getNewTransactionsSubscriptionUrlTestCases,
    getVETtransfersSubscriptionUrlTestCases,
    testWebSocketConnection
};
