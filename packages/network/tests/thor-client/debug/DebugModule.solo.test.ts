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
import { sendTransactionWithAccountIndex } from './fixture-thorest';

const TIMEOUT = 10000;

const TO = Address.of('0x0000000000000000000000000000456E65726779');

async function testTraceContractCall(
    thorClient: ThorClient,
    tracerName: TracerName,
    txPromise: Promise<TransactionReceipt | null>
): Promise<TraceReturnType<TracerName | undefined>> {
    const txReceipt = await txPromise;
    return await thorClient.debug.traceContractCall(
        {
            target: {
                to: TO,
                data: HexUInt.of(transfer1VTHOClause.data)
            },
            options: {
                caller: txReceipt?.gasPayer as string,
                gasPayer: txReceipt?.gasPayer as string
            },
            config: {}
        },
        tracerName
    );
}

async function testTransactionClause(
    thorClient: ThorClient,
    tracerName: TracerName,
    txPromise: Promise<TransactionReceipt | null>
): Promise<TraceReturnType<TracerName | undefined>> {
    const txReceipt = await txPromise;
    return await thorClient.debug.traceTransactionClause(
        {
            target: {
                blockId: BlockId.of(txReceipt?.meta.blockID as string),
                transaction: BlockId.of(txReceipt?.meta.txID as string),
                clauseIndex: 0
            },
            config: {}
        },
        tracerName
    );
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
        const senderAccountIndex = 7;
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 8;
        const tracerName = '4byte';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 9;
        const tracerName = 'call';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 10;
        const tracerName = 'noop';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 11;
        const tracerName = 'prestate';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 12;
        const tracerName = 'unigram';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 13;
        const tracerName = 'bigram';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 14;
        const tracerName = 'trigram';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 15;
        const tracerName = 'evmdis';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 16;
        const tracerName = 'opcount';
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
        const senderAccountIndex = 17;
        const tracerName = null;
        const txPromise = sendTransactionWithAccountIndex(
            senderAccountIndex,
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
