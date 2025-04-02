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
            id: '0x00000001922786e4dc260d2c1bc5ae0ac217ce49a3171c970921436a446eb7c7',
            size: 558,
            parentID:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            timestamp: 1743426529,
            gasLimit: 10000000000000,
            beneficiary: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            gasUsed: 44794,
            baseFeePerGas: '0x9184e72a000',
            totalScore: 1,
            txsRoot:
                '0xb554e10b358360a117495105e14fd20dd92bd95d74a37beb4cd56cbed5f34d35',
            txsFeatures: 1,
            stateRoot:
                '0xf3ff1d20688aa6035f8f2ad0e079bad84832aed08267320130f048a5157811ed',
            receiptsRoot:
                '0x7b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941d',
            com: false,
            signer: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
            isTrunk: true,
            isFinalized: false,
            transactions: [
                '0x500029471f4ae29e0520ac8a4e3f97bba59fec770edeb3dd687c408634c42969'
            ]
        };
        const actual = (
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RegularBlockResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- block BEST', async () => {
        const response = (
            await RetrieveRegularBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(RegularBlockResponse);
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
        const response = (
            await RetrieveRegularBlock.of(Revision.FINALIZED).askTo(httpClient)
        ).response;
        expect(response).toBeDefined();
        expect(response).toBeInstanceOf(RegularBlockResponse);
        expect(response?.toJSON()).toEqual(expected);
    });

    test('null <- block not found', async () => {
        const response = (
            await RetrieveRegularBlock.of(
                Revision.of(Math.pow(2, 32) - 1) // Max block address value.
            ).askTo(httpClient)
        ).response;
        expect(response).toBeNull();
    });
});
