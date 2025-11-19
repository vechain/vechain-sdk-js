import { TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { BlockId } from '@vechain/sdk-core';
// START_SNIPPET: DebugTraceTransactionClauseSnippet
// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);
// 2 - Trace the clause.
const result = await thorClient.debug.traceTransactionClause({
    target: {
        blockId: BlockId.of('0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'),
        transaction: BlockId.of('0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f'),
        clauseIndex: 0
    },
    config: {}
}, 'call');
// 3 - Print the result.
console.log(result);
// END_SNIPPET: DebugTraceTransactionClauseSnippet
