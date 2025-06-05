import { expect, jest } from '@jest/globals';
import { Revision } from '@vechain/sdk-core';
import { type HttpClient } from '@http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import {
    RegularBlockResponse,
    type RegularBlockResponseJSON,
    RetrieveRegularBlock,
    ThorError
} from '@thor';

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
 * @group unit/block
 */
describe('RetrieveRegularBlock UNIT tests', () => {
    test('err: <- bad revision', async () => {
        const status = 400;
        try {
            await RetrieveRegularBlock.of(new InvalidRevision()).askTo(
                mockHttpClient<Response>(
                    mockResponse(
                        'revision: strconv.ParseUint: parsing "invalid": invalid syntax',
                        status
                    )
                )
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('err <- incomplete block from Thor OK response', async () => {
        const status = 200; // Thor answers OK but with a bad body.
        const incompleteBlock: Partial<RegularBlockResponseJSON> = {
            number: 123,
            id: '0x0000000000000000000000000000000000000000'
        };
        try {
            await RetrieveRegularBlock.of(Revision.BEST).askTo(
                mockHttpClient<Response>(
                    mockResponse(
                        incompleteBlock as RegularBlockResponseJSON,
                        status
                    )
                )
            );
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- block 0', async () => {
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
        } satisfies RegularBlockResponseJSON;
        const actual = (
            await RetrieveRegularBlock.of(Revision.of(0)).askTo(
                mockHttpClient<Response>(mockResponse(expected, status))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
    });

    test('ok <- block 1', async () => {
        const status = 200;
        const expected = {
            number: 1,
            id: '0x0000000133d1fd47b8f94239b86d89aa42f8c652a02e1298d3ffcb88dacfc865',
            size: 556,
            parentID:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            timestamp: 1745691776,
            gasLimit: 150000000,
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: 44794,
            totalScore: 1,
            txsRoot:
                '0x5e4859b2ecf88a48f3071067cd63f383081b613261fd3419aeefeb480d7614ba',
            txsFeatures: 1,
            stateRoot:
                '0x7f65d724154a90fd1c6a5295e773cb5850bf14c371b61ade71ca0b2a1f49317b',
            receiptsRoot:
                '0x7b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941d',
            com: false,
            signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            isTrunk: true,
            isFinalized: false,
            baseFeePerGas: '0x9184e72a000',
            transactions: [
                '0x9cea6e21fa8e829f04f527dd4bc2737c0c10ae1c290ce083232690a81c684d8d'
            ]
        } satisfies RegularBlockResponseJSON;
        const actual = (
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(
                mockHttpClient<Response>(mockResponse(expected, status))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
    });

    test('ok <- block BEST', async () => {
        const status = 200;
        const expected = {
            number: 1899,
            id: '0x0000076b7f485e2b1e09bdbdeb62e9fe0c42f9b9269d07015bf8b0a72238af95',
            size: 366,
            parentID:
                '0x0000076a4319867444bb92ce20b4ce068eb526269e1583baf8c390c223926197',
            timestamp: 1745772860,
            gasLimit: 150000000,
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: 0,
            totalScore: 1899,
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
        } satisfies RegularBlockResponseJSON;

        const actual = await RetrieveRegularBlock.of(Revision.BEST).askTo(
            mockHttpClient<Response>(mockResponse(expected, status))
        );
        expect(actual.response).toEqual(new RegularBlockResponse(expected));
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
            await RetrieveRegularBlock.of(Revision.FINALIZED).askTo(
                mockHttpClient<Response>(mockResponse(expected, status))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
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
