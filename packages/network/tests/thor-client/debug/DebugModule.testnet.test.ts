import { describe, expect, test } from '@jest/globals';
import {
    TESTNET_URL,
    ThorClient,
    type TracerName,
    type TransactionTraceTarget
} from '../../../src';
import { ThorId } from '@vechain/sdk-core';
import { InvalidDataType } from '@vechain/sdk-errors';

const TIMEOUT = 5000;

/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 */
describe('DebugModule testnet tests', () => {
    const thorClient = ThorClient.at(TESTNET_URL);

    describe('traceContractCall method tests', () => {
        test('ok <- contract deployment', async () => {}, TIMEOUT);

        test('ok <- token transfer', async () => {}, TIMEOUT);
    });

    describe('traceTransactionClause method tests', () => {
        test(
            'InvalidDataType <- negative clause index',
            async () => {
                const target: TransactionTraceTarget = {
                    blockID: ThorId.of(
                        '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'
                    ),
                    transaction: 0,
                    clauseIndex: -1
                };
                const name: TracerName = 'call';
                await expect(
                    thorClient.debug.traceTransactionClause(
                        {
                            target,
                            config: {}
                        },
                        name
                    )
                ).rejects.toThrowError(InvalidDataType);
            },
            TIMEOUT
        );

        test(
            'InvalidDataType <- negative transaction index',
            async () => {
                const target: TransactionTraceTarget = {
                    blockID: ThorId.of(
                        '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'
                    ),
                    transaction: -1,
                    clauseIndex: 0
                };

                const name: TracerName = 'call';
                await expect(
                    thorClient.debug.traceTransactionClause(
                        {
                            target,
                            config: {}
                        },
                        name
                    )
                ).rejects.toThrowError(InvalidDataType);
            },
            TIMEOUT
        );

        test(
            'ok <- transaction 1 - transaction ID',
            async () => {
                const target: TransactionTraceTarget = {
                    blockID: ThorId.of(
                        '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'
                    ),
                    transaction: ThorId.of(
                        '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687'
                    ),
                    clauseIndex: 0
                };
                const name: TracerName = 'call';
                const expected = {
                    from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    gas: '0x11c5',
                    gasUsed: '0x0',
                    to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                    input: '0x02fe53050000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f6e657742617365546f6b656e5552490000000000000000000000000000000000',
                    value: '0x0',
                    type: 'CALL'
                };
                const actual = await thorClient.debug.traceTransactionClause(
                    {
                        target,
                        config: {}
                    },
                    name
                );
                expect(actual).toEqual(expected);
            },
            TIMEOUT
        );

        test(
            'ok <- transaction 1 - transaction index',
            async () => {
                const target: TransactionTraceTarget = {
                    blockID: ThorId.of(
                        '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'
                    ),
                    transaction: 0,
                    clauseIndex: 0
                };
                const name: TracerName = 'call';
                const expected = {
                    from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    gas: '0x11c5',
                    gasUsed: '0x0',
                    to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                    input: '0x02fe53050000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f6e657742617365546f6b656e5552490000000000000000000000000000000000',
                    value: '0x0',
                    type: 'CALL'
                };
                const actual = await thorClient.debug.traceTransactionClause(
                    {
                        target,
                        config: {}
                    },
                    name
                );
                expect(actual).toEqual(expected);
            },
            TIMEOUT
        );

        test(
            'ok <- transaction 2 - transaction id',
            async () => {
                const target: TransactionTraceTarget = {
                    blockID: ThorId.of(
                        '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'
                    ),
                    transaction: ThorId.of(
                        '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f'
                    ),
                    clauseIndex: 0
                };
                const name: TracerName = 'call';
                const expected = {
                    from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
                    gas: '0x8b92',
                    gasUsed: '0x50fa',
                    to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
                    input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
                    value: '0x0',
                    type: 'CALL'
                };
                const actual = await thorClient.debug.traceTransactionClause(
                    {
                        target,
                        config: {}
                    },
                    name
                );
                expect(actual).toEqual(expected);
            },
            TIMEOUT
        );

        test(
            'ok <- transaction 2 - transaction index',
            async () => {
                const target: TransactionTraceTarget = {
                    blockID: ThorId.of(
                        '0x010e80e3278e234b8a5d1195c376909456b94d1f7cf3cb7bfab1e8998dbcfa8f'
                    ),
                    transaction: 1,
                    clauseIndex: 0
                };
                const name: TracerName = 'call';
                const expected = {
                    from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
                    gas: '0x8b92',
                    gasUsed: '0x50fa',
                    to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
                    input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
                    value: '0x0',
                    type: 'CALL'
                };
                const actual = await thorClient.debug.traceTransactionClause(
                    {
                        target,
                        config: {}
                    },
                    name
                );
                expect(actual).toEqual(expected);
            },
            TIMEOUT
        );
    });
});
