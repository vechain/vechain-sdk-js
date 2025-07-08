import fastJsonStableStringify from 'fast-json-stable-stringify';
import { expect, jest } from '@jest/globals';
import { RawTx, RetrieveRawBlock, ThorError } from '@thor';
import { Revision } from '@vcdm';
import { type HttpClient } from '@http';
import { RawTxJSON } from '@thor/json';

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
 * @group unit/blocks
 */
describe('RetrieveBlock unit tests', () => {
    test('err: <- bad revision', async () => {
        const status = 400;
        try {
            await RetrieveRawBlock.of(new InvalidRevision()).askTo(
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
        const incompleteBlock: Partial<RawTxJSON> = {};
        try {
            await RetrieveRawBlock.of(Revision.BEST).askTo(
                mockHttpClient<Response>(
                    mockResponse(incompleteBlock as RawTxJSON, status)
                )
            );
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- block 0', async () => {
        const status = 200;
        const expected: RawTxJSON = {
            raw: '0xf8a5a0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080'
        } satisfies RawTxJSON;

        const actual = await RetrieveRawBlock.of(Revision.of(0)).askTo(
            mockHttpClient<Response>(mockResponse<RawTxJSON>(expected, status))
        );
        expect(actual.response).toEqual(new RawTx(expected));
    });

    test('ok <- block 1', async () => {
        const status = 200;
        const expected: RawTxJSON = {
            raw: '0xf90167a000000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f684680d24808408f0d18094f077b491b355e64048ce21e3a6fc4751eeea77fa82aefa01e2a05e4859b2ecf88a48f3071067cd63f383081b613261fd3419aeefeb480d7614ba01a07f65d724154a90fd1c6a5295e773cb5850bf14c371b61ade71ca0b2a1f49317ba07b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941db8920244cd7bc3104689c5cd06b33609223a0eccfb2755a550eeb171eab52aa16d3410c70c78115410cbd7c0e86ddef81b890dda7c815caa2ce3a24168501872da3600038fcdb55e197a2e5fc78218a8a27721a160741b3b8f1a0e40b8d619e44f238bac11efbf9c879da3247c604d560247a9ece6f6e09cf0252735d9bd90ff5f0d8dc23664e4a844fea3a7a1f7029e5d5499c2e9a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550808609184e72a000'
        } satisfies RawTxJSON;

        const actual = await RetrieveRawBlock.of(Revision.of(1)).askTo(
            mockHttpClient<Response>(mockResponse<RawTxJSON>(expected, status))
        );
        expect(actual.response).toEqual(new RawTx(expected));
    });

    test('ok <- BEST', async () => {
        const status = 200;
        const expected: RawTxJSON = {
            raw: '0xf90168a0000000d0fb413c0cc82d576c80a153919f9212220f5353e937bfbb645707eb798467eeb1208609184e72a00094f077b491b355e64048ce21e3a6fc4751eeea77fa8081d1e2a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c001a092f406093ab2618208f736ee05a60c0ea0f2b5fb35e30439d4c2214857e46fc3a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0b8920b39f006c57bb60b4c4931a3849d165156e42ceb4a6ef804c48087e86fc4f4a422334aaf130e0c7867059eb4b912042e2e69e30703939abe24dac15af2af23b40102dfa72c831f308b6a95e9c16076ca006d49d5e688f4d24d5fc94db6f530cb8acf326e0d9c929e0d6cfdcd0f937e87f3d5e3b6eabbfd880ee8dfc25a2cfcb8921d457d13e54298e195bd3558d22e21c457e9a035fa607237d3a46df85c7fd9c83403f16ffa4936abd68552c0ab41713fb8b2cb808609184e72a000'
        } satisfies RawTxJSON;

        const actual = await RetrieveRawBlock.of(Revision.BEST).askTo(
            mockHttpClient<Response>(mockResponse<RawTxJSON>(expected, status))
        );
        expect(actual.response).toEqual(new RawTx(expected));
    });

    test('ok <- FINALIZED', async () => {
        const status = 200;
        const expected: RawTxJSON = {
            raw: '0xf8a5a0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080'
        } satisfies RawTxJSON;
        const actual = await RetrieveRawBlock.of(Revision.FINALIZED).askTo(
            mockHttpClient<Response>(mockResponse<RawTxJSON>(expected, status))
        );
        expect(actual.response).toEqual(new RawTx(expected));
    });

    test('null <- block not found', async () => {
        const status = 200;
        const actual = await RetrieveRawBlock.of(
            Revision.of(Math.pow(2, 32) - 1) // Max block address value.
        ).askTo(mockHttpClient<Response>(mockResponse(null, status)));
        expect(actual.response).toBeNull();
    });
});
