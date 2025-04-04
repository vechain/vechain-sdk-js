import { describe, expect, test } from '@jest/globals';
import {
    FetchHttpClient,
    RegularBlockResponse,
    RetrieveRegularBlock,
    ThorNetworks
} from '../../../src';
import { Revision } from '@vechain/sdk-core';
import { RetrieveBlockError } from '../../../src/thor/blocks/RetrieveBlockError';

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

    test('ok <- block 1', async () => {
        const expected = {
            number: 1,
            id: '0x00000001eac0965c8940680a39950f91ea15c4eacae2c41b954fffd21ad447dc',
            size: 558,
            parentID:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            timestamp: 1743694068,
            gasLimit: 10000000000000,
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: 44794,
            totalScore: 1,
            txsRoot:
                '0x5a873aadffe804027e25e5f8af14d0bda855fe7a2d5dd8a8a6243d7bc0991797',
            txsFeatures: 1,
            stateRoot:
                '0x92f406093ab2618208f736ee05a60c0ea0f2b5fb35e30439d4c2214857e46fc3',
            receiptsRoot:
                '0x7b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941d',
            com: false,
            signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            isTrunk: true,
            isFinalized: false,
            baseFeePerGas: '0x9184e72a000',
            transactions: [
                '0x1b6e60a41461e3baf7510859510794394e5860ab6714d5aa1804b535a951371f'
            ]
        };
        const actual = (
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual).toEqual(new RegularBlockResponse(expected));
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(httpClient)
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
        };
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
