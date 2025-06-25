import { describe, expect, jest, test } from '@jest/globals';
import { IllegalArgumentError } from '@vechain/sdk-core';
import {
    RetrieveStorageRange,
    StorageRange,
    type StorageRangeJSON,
    type StorageRangeOptionJSON
} from '@thor/debug';
import type { HttpClient } from '@http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { ThorError } from '@thor';

const mockHttpClient = <T>(response: T): HttpClient => {
    return {
        post: jest.fn().mockReturnValue(response)
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
 * @group unit/debug
 */
describe('RetrieveStorageRange UNIT tests', () => {
    test('err <- of() - bad address', () => {
        const json: StorageRangeOptionJSON = {
            address: 'bad address',
            keyStart:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            maxResult: 10,
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        };
        expect(() => RetrieveStorageRange.of(json)).toThrowError(
            IllegalArgumentError
        );
    });

    test('err <- askTo() - bad address', async () => {
        const status = 400;
        // legal request, else it would be rejected by of() method
        const request: StorageRangeOptionJSON = {
            address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        } satisfies StorageRangeOptionJSON;
        try {
            await RetrieveStorageRange.of(request).askTo(
                mockHttpClient<Response>(
                    mockResponse('body: invalid length', status)
                )
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- askTo() - mock mainnet', async () => {
        const request: StorageRangeOptionJSON = {
            address: '0xD8CCDD85abDbF68DFEc95f06c973e87B1b5A9997',
            keyStart:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            maxResult: 10,
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        } satisfies StorageRangeOptionJSON;

        const expected = {
            storage: {
                '0x000e0255d1f748f8213c4cdb9becfd43dd7aa2bd949950666fca5bbd48725638':
                    {
                        key: '0x148793f559429927044688838b3539196a9da75bba926fdd4eaec3bba94b60b6',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x003b711e4f8a9908c878073c94e0582a67306255687c035bccf77f4b3cee5b1e':
                    {
                        key: '0xae8f6d61f9fc40b41c629093b588b50d4a1890b36d7c9d470bc8c20ace170ea8',
                        value: '0x0000000000000000000000000000000000000000000000001bc16d674ec80000'
                    },
                '0x005350cc854e6c697ba6d4c2f8349de7124b2f0c931d8a38aa4b9857ca710532':
                    {
                        key: '0x6faf590343929a5bc7f6b2f49248fb33908e8cf771c6f8681583925ced43078a',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x008c913004f03618010cfdf440ae961037d2014ab4e5e61bc75d144d33b35966':
                    {
                        key: '0x46f1c3cbd28359ea5f16c0a22672225f075939ea8f743807ef148a191a8a3bf4',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x00af5cdc67ceb4225b6582c72326f30922aa85111ca8a5c2f66ed60773475478':
                    {
                        key: '0x6f6796197765e42a10235197b9a8e3e7f845ffdde95790e2eab570a9dc0976aa',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x00b8c69dbceaa00ba76e65356b300831eef6668b06f25beff301cc17fc4ea757':
                    {
                        key: '0xbcb4f1ea82dfacce796569995fafaf2958aea2da380539be63d0c0b6b32983df',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x00cbe3e6abdf69941f535c0b7e798e4d5d04b7b1d135e646f6b8a855dca5a643':
                    {
                        key: '0xf3107c4cdc3caea286c1d5c4fbbb43b7001aef0dc25fb9861dd77c7f3b5e5d3d',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x00cd024259266d7a90e200355a20e0add4b210b92bd02d2ccce5e13ddee72042':
                    {
                        key: '0x1f508f4ff30a5f2638108e70f59165da9037e95a33386b678bf2b69db7be542a',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x00de2a77b40e196601234ef23c6194dac1c0a18a72885c499e4cd1a6187303d6':
                    {
                        key: '0x7785030d60fa832ef876491e17dcd663318b78cebd3503c1d51b490d6e69118a',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    },
                '0x00ee016a154e4c61a9296cc02e404b634bb2817ef3be96244995ab53f4020a7f':
                    {
                        key: '0xf14adb9d10b25d431715df868f08f74a27fb67c22df7c986e71f7a94f1439020',
                        value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
                    }
            },
            nextKey:
                '0x0176f4738e5240f19827b4cbe074a1cc11cab51208185fda49551794a278115d'
        } satisfies StorageRangeJSON;

        const actual = (
            await RetrieveStorageRange.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;

        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(StorageRange);
        expect(actual?.toJSON()).toEqual(expected);
    });
});
