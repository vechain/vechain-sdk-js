import { Revision } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';
import { RawBlockResponse, RetrieveRawBlock } from '@thor/thorest';
import { expect } from '@jest/globals';
import { type RawBlockJSON } from '@thor/thorest/json';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group solo/thor/blocks
 */
describe('RetrieveRawBlock SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    test('ok <- block 0', async () => {
        const expected = {
            raw: '0xf8afa0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a0e27acf5fa834d6f148b2eba3ad3d7d51d0a31f2c185a4a2cddf7a37e26a5a8e4a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080c980808609184e72a000'
        } satisfies RawBlockJSON;
        const actual = (
            await RetrieveRawBlock.of(Revision.of(0)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawBlockResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- block 1', async () => {
        const actual = (
            await RetrieveRawBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawBlockResponse);
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveRawBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawBlockResponse);
    });

    test('ok <- block FINALIZED', async () => {
        const expected = {
            raw: '0xf8afa0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a0e27acf5fa834d6f148b2eba3ad3d7d51d0a31f2c185a4a2cddf7a37e26a5a8e4a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080c980808609184e72a000'
        } satisfies RawBlockJSON;
        const actual = (
            await RetrieveRawBlock.of(Revision.FINALIZED).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawBlockResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('null <- block not found', async () => {
        const { response } = await RetrieveRawBlock.of(
            Revision.of(Math.pow(2, 32) - 1) // Max block address value.
        ).askTo(httpClient);
        expect(response).toBeNull();
    });
});
