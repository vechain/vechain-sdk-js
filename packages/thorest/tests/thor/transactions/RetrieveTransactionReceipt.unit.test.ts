import { describe, expect, jest, test } from '@jest/globals';
import { HexUInt32 } from '@vechain/sdk-core';
import {
    GetTxReceiptResponse,
    type GetTxReceiptResponseJSON,
    RetrieveTransactionReceipt,
    ThorError
} from '@thor';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import type { HttpClient } from '@http';

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
 * @group integration/transactions
 */
describe('RetrieveTransactionReceipt SOLO tests', () => {
    // You can't build an invalid Hex expression from the SDK,
    // hence the behavior of Thor rejecting an ill-formed tx is mocked.
    test('err: <- bad tx id', async () => {
        const status = 400;
        const txId = HexUInt32.of('0xDEADBEEF');
        try {
            await RetrieveTransactionReceipt.of(txId).askTo(
                mockHttpClient(mockResponse('id: invalid length', status))
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- tx found', async () => {
        const expected = {
            type: null,
            gasUsed: '44794',
            gasPayer: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            paid: '0x26da441abd4d90000',
            reward: '0x2676cda9d5028c000',
            reverted: false,
            outputs: [
                {
                    contractAddress: null,
                    events: [
                        {
                            address:
                                '0x0000000000000000000000000000506172616D73',
                            topics: [
                                '0x28e3246f80515f5c1ed987b133ef2f193439b25acba6a5e69f219e896fc9d179',
                                '0x000000000000000000000000000000000000626173652d6761732d7072696365'
                            ],
                            data: '0x000000000000000000000000000000000000000000000000000009184e72a000'
                        }
                    ],
                    transfers: []
                }
            ],
            meta: {
                blockID:
                    '0x00000001c3296a8528ffd0aa29a7f0379887137159817206626cb66b3760b4a3',
                blockNumber: 1,
                blockTimestamp: 1749136341,
                txID: '0x49144f58b7e5c0341573d68d3d69922ac017983ba07229d5c545b65a386759f1',
                txOrigin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'
            }
        } satisfies GetTxReceiptResponseJSON;
        const txId = HexUInt32.of(
            '0x49144f58b7e5c0341573d68d3d69922ac017983ba07229d5c545b65a386759f1'
        );
        const actual = (
            await RetrieveTransactionReceipt.of(txId).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxReceiptResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('null <- tx not found', async () => {
        const txId = HexUInt32.of(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
        const actual = (
            await RetrieveTransactionReceipt.of(txId).askTo(
                mockHttpClient(mockResponse(null, 200))
            )
        ).response;
        expect(actual).toBeNull();
    });
});
