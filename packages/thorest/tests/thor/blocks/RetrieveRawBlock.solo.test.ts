import { describe, expect, test } from '@jest/globals';
import { Revision } from '@vechain/sdk-core';
import {
    FetchHttpClient,
    RawTx,
    RetrieveRawBlock,
    ThorNetworks
} from '../../../src';
import { RetrieveBlockError } from '../../../src/thor/blocks/RetrieveBlockError';

class InvalidRevision extends Revision {
    constructor() {
        super('invalid');
    }
}

describe('RetrieveRawBlock SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('err: <- bad revision', async () => {
        const status = 400;
        try {
            await RetrieveRawBlock.of(new InvalidRevision()).askTo(httpClient);
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(RetrieveBlockError);
            expect((error as RetrieveBlockError).status).toBe(status);
        }
    });

    test('ok <- block 1', async () => {
        const expected = {
            raw: '0xf90169a000000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f68467eea8f48609184e72a00094f077b491b355e64048ce21e3a6fc4751eeea77fa82aefa01e2a05a873aadffe804027e25e5f8af14d0bda855fe7a2d5dd8a8a6243d7bc099179701a092f406093ab2618208f736ee05a60c0ea0f2b5fb35e30439d4c2214857e46fc3a07b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941db892cb26e6fc3ea86abadd77b30ec0c9cdcc29c026373d564eb6115c115f90826c4d34a37e603ba5bb4d0624d09f63a34d298967a0e26dc258b92af1d1805f9e8aa401038fcdb55e197a2e5fc78218a8a27721a160741b3b8f1a0e40b8d619e44f238bac11efbf9c879da3247c604d560247a9ece6f6e09cf0252735d9bd90ff5f0d8dc23664e4a844fea3a7a1f7029e5d5499c2e9a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550808609184e72a000'
        };
        const actual = (
            await RetrieveRawBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
        expect(actual).toEqual(new RawTx(expected));
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveRawBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
    });

    test('ok <- block FINALIZED', async () => {
        const expected = {
            raw: '0xf8a5a0ffffffff00000000000000000000000000000000000000000000000000000000845afb0400839896809400000000000000000000000000000000000000008080a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550a045b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c080'
        };
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
