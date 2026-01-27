import { expect } from '@jest/globals';
import { Revision } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';
import { ExpandedBlockResponse, RetrieveExpandedBlock } from '@thor/thorest';
import { type ExpandedBlockResponseJSON } from '@thor/thorest/json';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group solo/thor/blocks
 */
describe('RetrieveRegularBlock SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    test('ok <- block 0', async () => {
        const expected = {
            baseFeePerGas: '10000000000000',
            number: 0,
            id: '0x00000000bb55405beed90df9fea5acdb1cb7caba61b0d7513395f42efd30e558',
            size: 180,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1526400000,
            gasLimit: '10000000',
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: '0',
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0xe27acf5fa834d6f148b2eba3ad3d7d51d0a31f2c185a4a2cddf7a37e26a5a8e4',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        } satisfies ExpandedBlockResponseJSON;
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(0)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- block 1', async () => {
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
    });

    test('ok <- block FINALIZED', async () => {
        const expected = {
            baseFeePerGas: '10000000000000',
            number: 0,
            id: '0x00000000bb55405beed90df9fea5acdb1cb7caba61b0d7513395f42efd30e558',
            size: 180,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1526400000,
            gasLimit: '10000000',
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: '0',
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0xe27acf5fa834d6f148b2eba3ad3d7d51d0a31f2c185a4a2cddf7a37e26a5a8e4',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        } satisfies ExpandedBlockResponseJSON;
        const actual = (
            await RetrieveExpandedBlock.of(Revision.FINALIZED).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('null <- block not found', async () => {
        const actual = (
            await RetrieveExpandedBlock.of(
                Revision.of(Math.pow(2, 32) - 1) // Max block address value.
            ).askTo(httpClient)
        ).response;
        expect(actual).toBeNull();
    });
});
