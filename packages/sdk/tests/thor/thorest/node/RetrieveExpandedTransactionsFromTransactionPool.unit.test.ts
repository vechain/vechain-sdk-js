import {
    RetrieveTransactionsFromTransactionPool,
    Transactions
} from '@thor/thorest';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { type TransactionsJSON, type TxJSON } from '@thor/thorest/json';

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
 * @group unit/thor/node
 */
describe('RetrieveExpandedTransactionsFromTransactionPool UNIT tests', () => {
    test('ok <- askTo', async () => {
        const expectedTx = {
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
            maxFeePerGas: null,
            maxPriorityFeePerGas: null
        } satisfies TxJSON;
        const expected = [expectedTx] satisfies TransactionsJSON;
        const actual = (
            await RetrieveTransactionsFromTransactionPool.of().askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(new Transactions(expected));
    });
});
