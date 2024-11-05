import { Hex, vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { TESTING_CONTRACT_ADDRESS } from '../../fixture';
// eslint-disable-next-line import/no-named-default
import { default as NodeWebSocket } from 'isomorphic-ws';

/**
 * random address for `from` parameter
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
const fromRandomAddress = Hex.random(20).toString();

/**
 * random address for `to` parameter
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
const toRandomAddress = Hex.random(20).toString();

/**
 * `value` random BigInt
 */
// eslint-disable-next-line sonarjs/pseudo-random
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed, address indexed, uint256)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [fromRandomAddress, toRandomAddress],
        options: {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [fromRandomAddress], // Missing `to` parameter
        options: {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
        )}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 value)',
        valuesToEncode: [null, toRandomAddress], // Missing `from` parameter
        options: {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        )}&t2=0x000000000000000000000000${toRandomAddress.slice(2)}`
    },
    {
        event: 'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
        valuesToEncode: [fromRandomAddress, toRandomAddress, randomBigInt],
        options: {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?t0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        expectedURL: `wss://testnet.vechain.org/subscriptions/event?addr=${TESTING_CONTRACT_ADDRESS}&t0=0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822&t1=0x000000000000000000000000${fromRandomAddress.slice(
            2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            signerAddress: fromRandomAddress
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/transfer?txOrigin=${fromRandomAddress}`
    },

    {
        options: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            signerAddress: fromRandomAddress,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            sender: fromRandomAddress
        },
        expectedURL: `wss://testnet.vechain.org/subscriptions/transfer?txOrigin=${fromRandomAddress}&sender=${fromRandomAddress}`
    },
    {
        options: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
        let ws: WebSocket | NodeWebSocket;
        if (typeof WebSocket !== 'undefined') {
            ws = new WebSocket(url);
        } else {
            ws = new NodeWebSocket(url);
        }

        ws.onopen = () => {
            ws.close();
            resolve(true);
        };

        ws.onerror = () => {
            reject(new Error('WebSocket connection error: '));
        };

        ws.onclose = (event: CloseEvent) => {
            if (event.wasClean) {
                console.log(
                    `Closed cleanly, code=${event.code} reason=${event.reason}`
                );
            } else {
                console.log('Connection died');
                reject(new Error('Connection closed unexpectedly'));
            }
        };
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
