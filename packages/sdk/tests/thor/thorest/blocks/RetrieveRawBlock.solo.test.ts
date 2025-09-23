import { Revision } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';
import {
    RawTx,
    RetrieveRawBlock,
    ThorError,
    ThorNetworks
} from '@thor/thorest';
import { expect } from '@jest/globals';
import { type RawTxJSON } from '@thor/thorest/json';

class InvalidRevision extends Revision {
    constructor() {
        super('invalid');
    }
}

/**
 * @group integration/thor/blocks
 */
describe('RetrieveRawBlock SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('err: <- bad revision', async () => {
        try {
            await RetrieveRawBlock.of(new InvalidRevision()).askTo(httpClient);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            // Now we expect status 0 for network errors (when server is not running)
            // or status 400 for HTTP errors (when server is running but bad revision)
            const thorError = error as ThorError;
            expect([0, 400]).toContain(thorError.status);
        }
    });

    test('ok <- block 0', async () => {
        const expected = {
            raw: '0xf8a5a0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080'
        } satisfies RawTxJSON;
        const actual = (
            await RetrieveRawBlock.of(Revision.of(0)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- block 1', async () => {
        const actual = (
            await RetrieveRawBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveRawBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
    });

    test('ok <- block FINALIZED', async () => {
        const expected = {
            raw: '0xf8a5a0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080'
        } satisfies RawTxJSON;
        const actual = (
            await RetrieveRawBlock.of(Revision.FINALIZED).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
        expect(actual).toEqual(new RawTx(expected));
    });

    test('null <- block not found', async () => {
        const response = (
            await RetrieveRawBlock.of(
                Revision.of(Math.pow(2, 32) - 1) // Max block address value.
            ).askTo(httpClient)
        ).response;
        expect(response).toBeNull();
    });
});
