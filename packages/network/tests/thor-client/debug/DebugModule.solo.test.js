"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const fixture_1 = require("./fixture");
const src_1 = require("../../../src");
const fixture_thorest_1 = require("./fixture-thorest");
const fixture_2 = require("../../fixture");
const test_utils_1 = require("../../test-utils");
const TIMEOUT = 10000;
const TO = sdk_core_1.Address.of('0x0000000000000000000000000000456E65726779');
async function testTraceContractCall(thorClient, tracerName, txPromise) {
    const txReceipt = await txPromise;
    return await thorClient.debug.traceContractCall({
        target: {
            to: TO,
            data: sdk_core_1.HexUInt.of(fixture_1.transfer1VTHOClause.data)
        },
        options: {
            caller: txReceipt?.gasPayer,
            gasPayer: txReceipt?.gasPayer
        },
        config: {}
    }, tracerName);
}
async function testTransactionClause(thorClient, tracerName, txPromise) {
    const txReceipt = await txPromise;
    return await thorClient.debug.traceTransactionClause({
        target: {
            blockId: sdk_core_1.BlockId.of(txReceipt?.meta.blockID),
            transaction: sdk_core_1.BlockId.of(txReceipt?.meta.txID),
            clauseIndex: 0
        },
        config: {}
    }, tracerName);
}
/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 *
 * **NOTE**: these tests succeeds once per Thor Solo run.
 *           Stop and start Thor Solo to re-run tests.
 */
(0, globals_1.describe)('DebugModule testnet tests', () => {
    const thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    (0, globals_1.describe)('name = empty, sender account index = 7', () => {
        const tracerName = '';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = 4byte, sender account index = 8', () => {
        const tracerName = '4byte';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = call, sender account index = 9', () => {
        const tracerName = 'call';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = noop, sender account index = 10', () => {
        const tracerName = 'noop';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = prestate, sender account index = 11', () => {
        const tracerName = 'prestate';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = unigram, sender account index = 12', () => {
        const tracerName = 'unigram';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = bigram, sender account index = 13', () => {
        const tracerName = 'bigram';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = trigram, sender account index = 14', () => {
        const tracerName = 'trigram';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = evmdis, sender account index = 15', () => {
        const tracerName = 'evmdis';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = opcount, sender account index = 16', () => {
        const tracerName = 'opcount';
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
    (0, globals_1.describe)('name = null, sender account index = 17', () => {
        const tracerName = null;
        const txPromise = (0, test_utils_1.retryOperation)(async () => {
            return await (0, fixture_thorest_1.sendTransactionWithAccount)((0, fixture_2.getUnusedAccount)(), thorClient);
        }, 5, 2000);
        (0, globals_1.test)('ok <- traceContractCall', async () => {
            const result = await testTraceContractCall(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(result).toBeDefined();
        }, TIMEOUT);
        (0, globals_1.test)('ok <- traceTransactionClause', async () => {
            const actual = await testTransactionClause(thorClient, tracerName, txPromise);
            (0, globals_1.expect)(actual).toBeDefined();
        }, TIMEOUT);
    });
});
