import fastJsonStableStringify from 'fast-json-stable-stringify';
import { describe, expect, jest, test } from '@jest/globals';
import { Revision } from '@vechain/sdk-core';
import {
    ExpandedBlockResponse,
    type ExpandedBlockResponseJSON,
    type HttpClient,
    RetrieveBlockError,
    RetrieveExpandedBlock, RetrieveRegularBlock
} from '../../../src';

class InvalidRevision extends Revision {
    constructor() {
        super('invalid');
    }
}

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
 * VeChain expanded block - unit
 *
 * @group unit/block
 */
describe('RetrieveExpandedBlock UNIT tests', () => {
    test('err: <- bad revision', async () => {
        const status = 400;
        try {
            await RetrieveExpandedBlock.of(new InvalidRevision()).askTo(
                mockHttpClient<Response>(
                    mockResponse(
                        'revision: strconv.ParseUint: parsing "invalid": invalid syntax',
                        status
                    )
                )
            );
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(RetrieveBlockError);
            expect((error as RetrieveBlockError).status).toBe(status);
        }
    });

    test('err <- incomplete block from Thor OK response', async () => {
        const status = 200; // Thor answers OK but with a bad body.
        const incompleteBlock: Partial<ExpandedBlockResponseJSON> = {
            number: 123,
            id: '0x0000000000000000000000000000000000000000'
        };
        try {
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(
                mockHttpClient<Response>(
                    mockResponse(
                        incompleteBlock as ExpandedBlockResponseJSON,
                        status
                    )
                )
            );
        } catch (error) {
            expect(error).toBeInstanceOf(RetrieveBlockError);
            expect((error as RetrieveBlockError).status).toBe(status);
        }
    });

    test('ok <- block 1', async () => {
        const status = 200;
        const expected = {
            number: 1,
            id: '0x00000001c6874a9e540beb71cb058ee38e03631f903ce7887ac836e0cc7a69a7',
            size: 558,
            parentID:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            timestamp: 1745677588,
            gasLimit: 10000000000000,
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: 44794,
            totalScore: 1,
            txsRoot:
                '0x317d1da1f937f9c81a4075cda5104a76b84478c852feb6cec59815fa23923e6c',
            txsFeatures: 1,
            stateRoot:
                '0xbf8ac1dd43aa4a2fe9d55bf9752512f60e394b042f6349f203c5b45cf7f958f7',
            receiptsRoot:
                '0x7b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941d',
            com: false,
            signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            isTrunk: true,
            isFinalized: false,
            baseFeePerGas: '0x9184e72a000',
            transactions: [
                {
                    id: '0xd4a1c14f98d50cf75473be8df2e8c11bf556f38826762743ddb26600d2ce6cde',
                    type: 0,
                    chainTag: 246,
                    blockRef: '0x0000000000000000',
                    expiration: 4294967295,
                    clauses: [
                        {
                            to: '0x0000000000000000000000000000506172616d73',
                            value: '0x0',
                            data: '0x273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a000'
                        }
                    ],
                    gasPriceCoef: 0,
                    gas: 1000000,
                    origin: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                    delegator: null,
                    nonce: '0x4eaeb52f28c77011',
                    dependsOn: null,
                    size: 189,
                    gasUsed: 44794,
                    gasPayer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                    paid: '0x26da441abd4d90000',
                    reward: '0x2676cda9d5028c000',
                    reverted: false,
                    outputs: [
                        {
                            contractAddress: null,
                            events: [
                                {
                                    address:
                                        '0x0000000000000000000000000000506172616d73',
                                    topics: [
                                        '0x28e3246f80515f5c1ed987b133ef2f193439b25acba6a5e69f219e896fc9d179',
                                        '0x000000000000000000000000000000000000626173652d6761732d7072696365'
                                    ],
                                    data: '0x000000000000000000000000000000000000000000000000000009184e72a000'
                                }
                            ],
                            transfers: []
                        }
                    ]
                }
            ]
        } satisfies ExpandedBlockResponseJSON;
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(1)).askTo(
                mockHttpClient<Response>(mockResponse(expected, status))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual).toEqual(new ExpandedBlockResponse(expected));
    });

    test('ok <- block BEST', async () => {
        const status = 200;
        const expected = {
            number: 1595,
            id: '0x0000063b9400e519c27d5e79e0890210232a40a67168cc1dc89f071fb403b21a',
            size: 366,
            parentID:
                '0x0000063a57f49442603c62b1008b18e5257a510bd8a2ed657037cb1f5698800b',
            timestamp: 1745769810,
            gasLimit: 150000000,
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: 0,
            totalScore: 1595,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 1,
            stateRoot:
                '0x921a9a23b453acebc662889d6bb3d427d73b022b9cdc6fcafe24fc4b6d5d3f31',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            isTrunk: true,
            isFinalized: false,
            baseFeePerGas: '0x9184e72a000',
            transactions: []
        };
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(1)).askTo(
                mockHttpClient<Response>(mockResponse(expected, status))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual).toEqual(new ExpandedBlockResponse(expected));
    });

    test('ok <- block FINALIZED', async () => {
        const status = 200;
        const expected = {
            number: 0,
            id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1526400000,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        };
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(1)).askTo(
                mockHttpClient<Response>(mockResponse(expected, status))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual).toEqual(new ExpandedBlockResponse(expected));
    });

    test('null <- block not found', async () => {
        const status = 200;
        const actual = (
            await RetrieveRegularBlock.of(
                Revision.of(Math.pow(2, 32) - 1) // Max block address value.
            ).askTo(mockHttpClient<Response>(mockResponse(null, status)))
        ).response;
        expect(actual).toBeNull();
    });
});
