import { HttpClient, ThorClient } from '@vechain/sdk-network';

// 1 - Create thor client for testnet
const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Retrieve the storage range.
const result = await thorClient.debug.retrieveStorageRange({
    target: {
        blockID:
            '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
        transaction: 0,
        clauseIndex: 0
    },
    options: {
        address: '0x0000000000000000000000000000456E65726779',
        keyStart:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        maxResult: 10
    }
});

// 3 - Print the result.
console.log(result);
