import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Filters event logs based on the provided criteria.
const eventLogs = await thorestTestnetClient.logs.filterEventLogs({
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    options: {
        offset: 0,
        limit: 10
    },
    criteriaSet: [
        {
            address: '0x0000000000000000000000000000456E65726779',
            topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            topic1: '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        }
    ],
    order: 'asc'
});
console.log(eventLogs);

// Filters transfer logs based on the provided criteria.
const transferLogs = await thorestTestnetClient.logs.filterTransferLogs({
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    options: {
        offset: 0,
        limit: 10
    },
    criteriaSet: [
        {
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        }
    ],
    order: 'asc'
});
console.log(transferLogs);
