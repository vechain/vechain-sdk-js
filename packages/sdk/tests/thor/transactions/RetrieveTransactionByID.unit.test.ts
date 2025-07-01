/**
 * @group unit/transactions
 */
import { Hex, HexUInt32 } from '@vechain/sdk-core';
import {
    GetTxResponse,
    type GetTxResponseJSON,
    RetrieveTransactionByID,
    ThorError
} from '@thor';
import type { HttpClient } from '@http';
import { expect, jest } from '@jest/globals';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const mockHttpClient = <T>(response: T): HttpClient => {
    return {
        get: jest.fn().mockReturnValue(response)
    } as unknown as HttpClient;
};

const mockResponse = <T>(body: T, status: number): Response => {
    const init: ResponseInit = {
        status,
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    };
    return new Response(fastJsonStableStringify(body), init);
};

/**
 * @group unit/transactions
 */
describe('RetrieveTransactionByID UNIT tests', () => {
    test('err <- bad tx id', async () => {
        const status = 400;
        const txId = HexUInt32.of('0xDEADBEEF');
        try {
            await RetrieveTransactionByID.of(txId).askTo(
                mockHttpClient(mockResponse('id: invalid length', status))
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
        const txId = HexUInt32.of(
            '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a'
        );
        const head = HexUInt32.of('0xDEADBEEF');
        try {
            await RetrieveTransactionByID.of(txId)
                .withHead(head)
                .askTo(
                    mockHttpClient(mockResponse('head: invalid length', status))
                );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- tx id', async () => {
        const expected = {
            id: '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a',
            type: 0,
            chainTag: 246,
            blockRef: '0x0000000000000000',
            expiration: 4294967295,
            clauses: [
                {
                    to: '0x0000000000000000000000000000506172616D73',
                    value: '0x0',
                    data: '0x273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a000'
                }
            ],
            gasPriceCoef: '0',
            gas: '1000000',
            origin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            delegator: null,
            nonce: '0xd618d2a4bb864d7f',
            dependsOn: null,
            size: 189,
            meta: {
                blockID:
                    '0x000000015e6a01cfad0b4ad70e93d4c3e0672d045eaff79cea9bd68d6d98d6ed',
                blockNumber: 1,
                blockTimestamp: 1749206514
            },
            maxFeePerGas: null,
            maxPriorityFeePerGas: null
        } satisfies GetTxResponseJSON;
        const actual = (
            await RetrieveTransactionByID.of(Hex.of(expected.id)).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and head', async () => {
        const expected = {
            id: '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a',
            type: 0,
            chainTag: 246,
            blockRef: '0x0000000000000000',
            expiration: 4294967295,
            clauses: [
                {
                    to: '0x0000000000000000000000000000506172616D73',
                    value: '0x0',
                    data: '0x273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a000'
                }
            ],
            gasPriceCoef: '0',
            gas: '1000000',
            origin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            delegator: null,
            nonce: '0xd618d2a4bb864d7f',
            dependsOn: null,
            size: 189,
            meta: {
                blockID:
                    '0x000000015e6a01cfad0b4ad70e93d4c3e0672d045eaff79cea9bd68d6d98d6ed',
                blockNumber: 1,
                blockTimestamp: 1749206514
            },
            maxFeePerGas: null,
            maxPriorityFeePerGas: null
        } satisfies GetTxResponseJSON;
        const actual = (
            await RetrieveTransactionByID.of(Hex.of(expected.id))
                .withHead(Hex.of(expected.meta.blockID))
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and pending', async () => {
        const expected = {
            id: '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a',
            type: 0,
            chainTag: 246,
            blockRef: '0x0000000000000000',
            expiration: 4294967295,
            clauses: [
                {
                    to: '0x0000000000000000000000000000506172616D73',
                    value: '0x0',
                    data: '0x273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a000'
                }
            ],
            gasPriceCoef: '0',
            gas: '1000000',
            origin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            delegator: null,
            nonce: '0xd618d2a4bb864d7f',
            dependsOn: null,
            size: 189,
            meta: {
                blockID:
                    '0x000000015e6a01cfad0b4ad70e93d4c3e0672d045eaff79cea9bd68d6d98d6ed',
                blockNumber: 1,
                blockTimestamp: 1749206514
            },
            maxFeePerGas: null,
            maxPriorityFeePerGas: null
        } satisfies GetTxResponseJSON;
        const actual = (
            await RetrieveTransactionByID.of(Hex.of(expected.id))
                .withPending(false)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and head and pending', async () => {
        const expected = {
            id: '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a',
            type: 0,
            chainTag: 246,
            blockRef: '0x0000000000000000',
            expiration: 4294967295,
            clauses: [
                {
                    to: '0x0000000000000000000000000000506172616D73',
                    value: '0x0',
                    data: '0x273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a000'
                }
            ],
            gasPriceCoef: '0',
            gas: '1000000',
            origin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            delegator: null,
            nonce: '0xd618d2a4bb864d7f',
            dependsOn: null,
            size: 189,
            meta: {
                blockID:
                    '0x000000015e6a01cfad0b4ad70e93d4c3e0672d045eaff79cea9bd68d6d98d6ed',
                blockNumber: 1,
                blockTimestamp: 1749206514
            },
            maxFeePerGas: null,
            maxPriorityFeePerGas: null
        } satisfies GetTxResponseJSON;
        const actual = (
            await RetrieveTransactionByID.of(Hex.of(expected.id))
                .withHead(Hex.of(expected.meta.blockID))
                .withPending(false)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('null <- tx not found', async () => {
        const txId = HexUInt32.of(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        const actual = (
            await RetrieveTransactionByID.of(txId).askTo(
                mockHttpClient(mockResponse(null, 200))
            )
        ).response;
        expect(actual).toBeNull();
    });
});
