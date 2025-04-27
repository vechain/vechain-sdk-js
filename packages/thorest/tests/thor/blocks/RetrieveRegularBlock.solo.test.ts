import { describe, expect, test } from '@jest/globals';
import {
    FetchHttpClient,
    RegularBlockResponse,
    type RegularBlockResponseJSON,
    RetrieveBlockError,
    RetrieveRegularBlock,
    ThorNetworks
} from '../../../src';
import { Revision } from '@vechain/sdk-core';

class InvalidRevision extends Revision {
    constructor() {
        super('invalid');
    }
}

describe('RetrieveRegularBlock SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('err: <- bad revision', async () => {
        const status = 400;
        try {
            await RetrieveRegularBlock.of(new InvalidRevision()).askTo(
                httpClient
            );
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(RetrieveBlockError);
            expect((error as RetrieveBlockError).status).toBe(status);
        }
    });

    test('ok <- block 0', async () => {
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
            await RetrieveRegularBlock.of(Revision.of(0)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
    });

    test('ok <- block 1', async () => {
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
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveRegularBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
    });

    test('ok <- block FINALIZED', async () => {
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
            await RetrieveRegularBlock.of(Revision.FINALIZED).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
    });

    test('null <- block not found', async () => {
        const actual = (
            await RetrieveRegularBlock.of(
                Revision.of(Math.pow(2, 32) - 1) // Max block address value.
            ).askTo(httpClient)
        ).response;
        expect(actual).toBeNull();
    });
});
