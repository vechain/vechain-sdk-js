/**
 * @group unit/transactions
 */
import { HexUInt32 } from '@vcdm';
import { GetRawTxResponse, RetrieveRawTransactionByID, ThorError } from '@thor';
import { type GetRawTxResponseJSON } from '@thor/json';
import { expect } from '@jest/globals';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../MockHttpClient';

/**
 * @group unit/thor/transactions
 */
describe('RetrieveRawTransactionByID UNIT tests', () => {
    const txId = HexUInt32.of(
        '0x923845386a6aec8d7125be9b18b816a6573ce71a08fa2534bc8b35c6ff759997'
    );

    const head = HexUInt32.of(
        '0x0000000166cf48bedde03cbf7a257ffde00a660ab81435340d15d583a376b3ed'
    );

    test('err <- bad tx id', async () => {
        const status = 400;
        const txId = HexUInt32.of('0xDEADBEEF');
        try {
            await RetrieveRawTransactionByID.of(txId).askTo(
                mockHttpClientWithError('id: invalid length', 'get')
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('err <- bad head', async () => {
        const status = 400;
        const head = HexUInt32.of('0xDEADBEEF');
        try {
            await RetrieveRawTransactionByID.of(txId)
                .withHead(head)
                .askTo(mockHttpClientWithError('head: invalid length', 'get'));
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).not.toBe('Should not reach here.');
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- tx id', async () => {
        const expected = {
            raw: '0xf8bb81f68084fffffffff85ef85c940000000000000000000000000000506172616d7380b844273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a00080830f42408088112f26ccc241c5d6c0b8411f9a01e6e6bb7c0116dcc16ed95d641f43a7f9adf228e046c51421992cbfe41947f85eaadfc55e57a2df356ccfd1fbd7a06eb9ef1e229a6a868365ecadbafb6001',
            meta: {
                blockID:
                    '0x0000000166cf48bedde03cbf7a257ffde00a660ab81435340d15d583a376b3ed',
                blockNumber: 1,
                blockTimestamp: 1749218130
            }
        } satisfies GetRawTxResponseJSON;
        const txId = HexUInt32.of(
            '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a'
        );
        const actual = (
            await RetrieveRawTransactionByID.of(txId).askTo(
                mockHttpClient(expected, 'get', true, 200)
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and head', async () => {
        const expected = {
            raw: '0xf8bb81f68084fffffffff85ef85c940000000000000000000000000000506172616d7380b844273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a00080830f42408088112f26ccc241c5d6c0b8411f9a01e6e6bb7c0116dcc16ed95d641f43a7f9adf228e046c51421992cbfe41947f85eaadfc55e57a2df356ccfd1fbd7a06eb9ef1e229a6a868365ecadbafb6001',
            meta: {
                blockID:
                    '0x0000000166cf48bedde03cbf7a257ffde00a660ab81435340d15d583a376b3ed',
                blockNumber: 1,
                blockTimestamp: 1749218130
            }
        } satisfies GetRawTxResponseJSON;
        const actual = (
            await RetrieveRawTransactionByID.of(txId)
                .withHead(head)
                .askTo(mockHttpClient(expected, 'get', true, 200))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and pending', async () => {
        const expected = {
            raw: '0xf8bb81f68084fffffffff85ef85c940000000000000000000000000000506172616d7380b844273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a00080830f42408088112f26ccc241c5d6c0b8411f9a01e6e6bb7c0116dcc16ed95d641f43a7f9adf228e046c51421992cbfe41947f85eaadfc55e57a2df356ccfd1fbd7a06eb9ef1e229a6a868365ecadbafb6001',
            meta: {
                blockID:
                    '0x0000000166cf48bedde03cbf7a257ffde00a660ab81435340d15d583a376b3ed',
                blockNumber: 1,
                blockTimestamp: 1749218130
            }
        } satisfies GetRawTxResponseJSON;
        const actual = (
            await RetrieveRawTransactionByID.of(txId)
                .withPending(false)
                .askTo(mockHttpClient(expected, 'get', true, 200))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and head and pending', async () => {
        const expected = {
            raw: '0xf8bb81f68084fffffffff85ef85c940000000000000000000000000000506172616d7380b844273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a00080830f42408088112f26ccc241c5d6c0b8411f9a01e6e6bb7c0116dcc16ed95d641f43a7f9adf228e046c51421992cbfe41947f85eaadfc55e57a2df356ccfd1fbd7a06eb9ef1e229a6a868365ecadbafb6001',
            meta: {
                blockID:
                    '0x0000000166cf48bedde03cbf7a257ffde00a660ab81435340d15d583a376b3ed',
                blockNumber: 1,
                blockTimestamp: 1749218130
            }
        } satisfies GetRawTxResponseJSON;
        const actual = (
            await RetrieveRawTransactionByID.of(txId)
                .withHead(head)
                .withPending(false)
                .askTo(mockHttpClient(expected, 'get', true, 200))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetRawTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('null <- tx not found', async () => {
        const txId = HexUInt32.of(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        const actual = (
            await RetrieveRawTransactionByID.of(txId).askTo(
                mockHttpClient(null, 'get', true, 200)
            )
        ).response;
        expect(actual).toBeNull();
    });
});
