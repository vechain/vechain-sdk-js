import { describe, expect, test } from '@jest/globals';
import { Address, BlockId, HexUInt } from '@vechain/sdk-core';
import { transfer1VTHOClause } from '../transactions/fixture';
import {
    THOR_SOLO_URL,
    ThorClient,
    type TraceReturnType,
    type TracerName,
    type TransactionReceipt
} from '../../../src';
import { sendTransactionWithAccount } from './fixture-thorest';
import { getUnusedAccount } from '../../fixture';

const TIMEOUT = 10000;

const TO = Address.of('0x0000000000000000000000000000456E65726779');

// --- Simple test logger (always on, no env gating) ---
const debugNow = (): string => new Date().toISOString();
const safeStringify = (obj: unknown): string => {
    try {
        return JSON.stringify(
            obj,
            (_k, v) => (typeof v === 'bigint' ? `${v.toString()}n` : v),
            2
        );
    } catch {
        return String(obj);
    }
};
const tlog = (ctx: string, step: string, data?: unknown): void => {
    if (data === undefined) {
        // eslint-disable-next-line no-console
        console.log(`[DebugTest ${debugNow()}] ${ctx} :: ${step}`);
    } else {
        // eslint-disable-next-line no-console
        console.log(
            `[DebugTest ${debugNow()}] ${ctx} :: ${step} -> ${safeStringify(data)}`
        );
    }
};

async function testTraceContractCall(
    thorClient: ThorClient,
    tracerName: TracerName,
    txPromise: Promise<TransactionReceipt | null>,
    ctxLabel: string = 'traceContractCall'
): Promise<TraceReturnType<TracerName | undefined>> {
    const ctx = ctxLabel;
    tlog(ctx, 'start', { tracerName });
    tlog(ctx, 'awaiting transaction receipt');
    const txReceipt = await txPromise;
    tlog(ctx, 'got transaction receipt', {
        txID: txReceipt?.meta?.txID,
        blockID: txReceipt?.meta?.blockID,
        gasPayer: txReceipt?.gasPayer
    });

    const request = {
        target: {
            to: TO,
            data: HexUInt.of(transfer1VTHOClause.data)
        },
        options: {
            caller: txReceipt?.gasPayer as string,
            gasPayer: txReceipt?.gasPayer as string
        },
        config: {}
    } as const;

    tlog(ctx, 'constructed traceContractCall request', request);

    try {
        tlog(ctx, 'calling thorClient.debug.traceContractCall');
        const result = await thorClient.debug.traceContractCall(request, tracerName);
        tlog(ctx, 'received response', result);
        return result;
    } catch (err) {
        tlog(ctx, 'error thrown', {
            name: (err as Error)?.name,
            message: (err as Error)?.message
        });
        throw err;
    }
}

async function testTransactionClause(
    thorClient: ThorClient,
    tracerName: TracerName,
    txPromise: Promise<TransactionReceipt | null>,
    ctxLabel: string = 'traceTransactionClause'
): Promise<TraceReturnType<TracerName | undefined>> {
    const ctx = ctxLabel;
    tlog(ctx, 'start', { tracerName });
    tlog(ctx, 'awaiting transaction receipt');
    const txReceipt = await txPromise;
    tlog(ctx, 'got transaction receipt', {
        txID: txReceipt?.meta?.txID,
        blockID: txReceipt?.meta?.blockID
    });

    const request = {
        target: {
            blockId: BlockId.of(txReceipt?.meta.blockID as string),
            transaction: BlockId.of(txReceipt?.meta.txID as string),
            clauseIndex: 0
        },
        config: {}
    } as const;

    tlog(ctx, 'constructed traceTransactionClause request', request);

    try {
        tlog(ctx, 'calling thorClient.debug.traceTransactionClause');
        const result = await thorClient.debug.traceTransactionClause(
            request,
            tracerName
        );
        tlog(ctx, 'received response', result);
        return result;
    } catch (err) {
        tlog(ctx, 'error thrown', {
            name: (err as Error)?.name,
            message: (err as Error)?.message
        });
        throw err;
    }
}

/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 *
 * **NOTE**: these tests succeeds once per Thor Solo run.
 *           Stop and start Thor Solo to re-run tests.
 */
describe('DebugModule testnet tests', () => {
    const thorClient = ThorClient.at(THOR_SOLO_URL);

    describe('name = empty, sender account index = 7', () => {
        const tracerName = '';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );

        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = 4byte, sender account index = 8', () => {
        const tracerName = '4byte';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = call, sender account index = 9', () => {
        const tracerName = 'call';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = noop, sender account index = 10', () => {
        const tracerName = 'noop';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = prestate, sender account index = 11', () => {
        const tracerName = 'prestate';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = unigram, sender account index = 12', () => {
        const tracerName = 'unigram';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = bigram, sender account index = 13', () => {
        const tracerName = 'bigram';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = trigram, sender account index = 14', () => {
        const tracerName = 'trigram';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = evmdis, sender account index = 15', () => {
        const tracerName = 'evmdis';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = opcount, sender account index = 16', () => {
        const tracerName = 'opcount';
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });

    describe('name = null, sender account index = 17', () => {
        const tracerName = null;
        const txPromise = sendTransactionWithAccount(
            getUnusedAccount(),
            thorClient
        );
        test(
            'ok <- traceContractCall',
            async () => {
                const result = await testTraceContractCall(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(result).toBeDefined();
            },
            TIMEOUT
        );

        test(
            'ok <- traceTransactionClause',
            async () => {
                const actual = await testTransactionClause(
                    thorClient,
                    tracerName,
                    txPromise
                );
                expect(actual).toBeDefined();
            },
            TIMEOUT
        );
    });
});
