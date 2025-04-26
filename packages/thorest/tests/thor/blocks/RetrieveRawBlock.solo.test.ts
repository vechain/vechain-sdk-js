import { describe, expect, test } from '@jest/globals';
import { Revision } from '@vechain/sdk-core';
import {
    FetchHttpClient,
    RawTx,
    type RawTxJSON,
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
            raw: '0xf90169a000000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f684680ced148609184e72a00094f077b491b355e64048ce21e3a6fc4751eeea77fa82aefa01e2a0317d1da1f937f9c81a4075cda5104a76b84478c852feb6cec59815fa23923e6c01a0bf8ac1dd43aa4a2fe9d55bf9752512f60e394b042f6349f203c5b45cf7f958f7a07b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941db892c15115cf3b5f7184b232afc20b82d9faac5b7bac2cdf0856d9c6caedb14e3df654cfae97ca3cd58ba7b6c6021dadf4c8450e102916ce26afed43a4799198494800038fcdb55e197a2e5fc78218a8a27721a160741b3b8f1a0e40b8d619e44f238bac11efbf9c879da3247c604d560247a9ece6f6e09cf0252735d9bd90ff5f0d8dc23664e4a844fea3a7a1f7029e5d5499c2e9a093de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550808609184e72a000'
        } satisfies RawTxJSON;
        const actual = (
            await RetrieveRawBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(RawTx);
        expect(actual?.toJSON()).toEqual(expected);
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
