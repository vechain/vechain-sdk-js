import { TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
// START_SNIPPET: LogsSnippet
// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);
// 2 - Filter event logs based on the provided criteria. (EXAMPLE 1)
const eventLogs = await thorClient.logs.filterRawEventLogs({
    // Specify the range of blocks to search for events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 3
    },
    // Define criteria for filtering events
    criteriaSet: [
        {
            // Contract address to filter events
            address: '0x0000000000000000000000000000456E65726779',
            // Topics to further narrow down the search
            topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            topic1: '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        }
    ],
    // Specify the order in which logs should be retrieved (ascending in this case)
    order: 'asc'
});
// 3 - Filter again event logs based on the provided criteria. (EXAMPLE 2)
const transferLogs = await thorClient.logs.filterTransferLogs({
    // Specify the range of blocks to search for transfer events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 3
    },
    // Define criteria for filtering transfer events
    criteriaSet: [
        {
            // Transaction origin, sender, and recipient addresses to filter transfer events
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        }
    ],
    // Specify the order in which transfer logs should be retrieved (ascending in this case)
    order: 'asc'
});
// END_SNIPPET: LogsSnippet
expect(eventLogs).toEqual([
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e55fff280',
        meta: {
            blockID: '0x000060716a6decc7127d221e8a53cd7b33992db6236490f79d47585f9ae7ca14',
            blockNumber: 24689,
            blockTimestamp: 1530261290,
            txID: '0x0ee8df3a9de6787ec0848ea8951ed8899bb053b6b4af167228dd7c0c012f5346',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
        meta: {
            blockID: '0x00006135c993e6cd1ed99aac34679caac80759764ecb01431c9bea0199f3bf4c',
            blockNumber: 24885,
            blockTimestamp: 1530263250,
            txID: '0x86b3364c0faf2df6365b975cf1bd8046264b1eeaa2f266fe15b2df27d7954f65',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000f881a94423f22ee9a0e3e1442f515f43c966b7ed'
        ],
        data: '0x00000000000000000000000000000000000000000000021e19e0c9bab2400000',
        meta: {
            blockID: '0x000069fa97729ea3aaddd0756bb2bf2044fc16cb7d2b391b7982059deb43a86c',
            blockNumber: 27130,
            blockTimestamp: 1530285700,
            txID: '0x9edf26009aa903e2c5e7afbb39a547c9cf324a7f3eedafc33691ce2c9e5c9541',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    }
]);
expect(transferLogs).toEqual([
    {
        sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
        recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        amount: '0x152d02c7e14af6800000',
        meta: {
            blockID: '0x00003abbf8435573e0c50fed42647160eabbe140a87efbe0ffab8ef895b7686e',
            blockNumber: 15035,
            blockTimestamp: 1530164750,
            txID: '0x9daa5b584a98976dfca3d70348b44ba5332f966e187ba84510efb810a0f9f851',
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            clauseIndex: 0
        }
    }
]);
