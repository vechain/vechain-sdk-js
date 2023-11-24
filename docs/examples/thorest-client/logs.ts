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

// Filters event logs based on the provided criteria.
const eventLogs = await thorestTestnetClient.logs.filterEventLogs({
    // Specify the range of blocks to search for events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 10
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
expect(eventLogs).toBeDefined();

// Filters transfer logs based on the provided criteria.
const transferLogs = await thorestTestnetClient.logs.filterTransferLogs({
    // Specify the range of blocks to search for transfer events
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    // Additional options for the query, such as offset and limit
    options: {
        offset: 0,
        limit: 10
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
expect(transferLogs).toBeDefined();
