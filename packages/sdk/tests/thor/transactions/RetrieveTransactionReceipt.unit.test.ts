import { describe, expect, jest, test } from '@jest/globals';
import { Hex, HexUInt32 } from '@vcdm';
import {
    GetTxReceiptResponse,
    RetrieveTransactionReceipt,
    ThorError
} from '@thor';
import { type GetTxReceiptResponseJSON } from '@thor/json';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockHttpClient';

/**
 * @group unit/transactions
 */
describe('RetrieveTransactionReceipt UNIT tests', () => {
    // You can't build an invalid Hex expression from the SDK,
    // hence the behavior of Thor rejecting an ill-formed tx is mocked.
    test('err: <- bad tx id', async () => {
        const status = 400;
        const txId = HexUInt32.of('0xDEADBEEF');
        try {
            await RetrieveTransactionReceipt.of(txId).askTo(
                mockHttpClientWithError('id: invalid length', 'get')
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
        const actual = (
            await RetrieveTransactionReceipt.of(
                Hex.of(expected.meta.txID)
            ).askTo(mockHttpClient(expected, 'get', true, 200))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetTxReceiptResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- tx id and head', async () => {
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
                    '0x000000015e6a01cfad0b4ad70e93d4c3e0672d045eaff79cea9bd68d6d98d6ed',
                blockNumber: 1,
                blockTimestamp: 1749206514,
                txID: '0xa3b9c5083393e18f8cdef04639e657ddd33a0063315f8b8383753a6d3b80996a',
                txOrigin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'
            }
        } satisfies GetTxReceiptResponseJSON;
        const actual = (
            await RetrieveTransactionReceipt.of(Hex.of(expected.meta.txID))
                .withHead(Hex.of(expected.meta.blockID))
                .askTo(mockHttpClient(expected, 'get', true, 200))
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
                mockHttpClient(null, 'get', true, 200)
            )
        ).response;
        expect(actual).toBeNull();
    });
});
