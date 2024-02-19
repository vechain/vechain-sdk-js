import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 -

const result = await thorClient.debug.traceTransactionClause(
    {
        target: {
            blockID:
                '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f',
            transaction:
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
            clauseIndex: 0
        },
        config: {}
    },
    null
);
console.log(result);
