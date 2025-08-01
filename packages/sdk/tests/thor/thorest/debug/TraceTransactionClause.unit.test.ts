import { describe, expect, jest, test } from '@jest/globals';
import { TraceTransactionClause } from '@thor/thorest/debug';
import { type PostDebugTracerRequestJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';
import type { HttpClient } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { ThorError } from '@thor/thorest';

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
describe('TraceTransactionClause UNIT tests', () => {
    test('err <- of() - illegal', () => {
        const expected: PostDebugTracerRequestJSON = {
            name: 'call',
            config: { some: 'config' },
            target: 'illegal terget'
        };
        expect(() => TraceTransactionClause.of(expected)).toThrowError(
            IllegalArgumentError
        );
    });

    test('err <- askTo() - illegal target', async () => {
        const status = 400;
        // legal request, else it would be rejected by of() method
        const request: PostDebugTracerRequestJSON = {
            name: 'call',
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        };
        try {
            await TraceTransactionClause.of(request).askTo(
                mockHttpClient(mockResponse('Invalid target', status))
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- askTo() - mock mainnet', async () => {
        const request = {
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0',
            name: 'call',
            config: {}
        } satisfies PostDebugTracerRequestJSON;
        const expected = {
            from: '0xa416bdda32b00e218f08ace220bab512c863ff2f',
            gas: '0x3b156',
            gasUsed: '0x33c26',
            to: '0x576da7124c7bb65a692d95848276367e5a844d95',
            input: '0x18cbafe5000000000000000000000000000000000000000000000278e72c3332ed8c000000000000000000000000000000000000000000000000001012739ef982f8000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000a416bdda32b00e218f08ace220bab512c863ff2f0000000000000000000000000000000000000000000000000000000065805a8800000000000000000000000000000000000000000000000000000000000000020000000000000000000000005db3c8a942333f6468176a870db36eef120a34dc00000000000000000000000045429a2255e7248e57fce99e7239aed3f84b7a53',
            output: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000278e72c3332ed8c00000000000000000000000000000000000000000000000000101ed507302f239979',
            calls: [
                {
                    from: '0x576da7124c7bb65a692d95848276367e5a844d95',
                    gas: '0x394d6',
                    gasUsed: '0x25c',
                    to: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                    input: '0x0902f1ac',
                    output: '0x000000000000000000000000000000000000000000002d2d5e3d1ebfb977035700000000000000000000000000000000000000000006e5e9a2fe8a044306f2330000000000000000000000000000000000000000000000000000000065805696',
                    type: 'STATICCALL'
                },
                {
                    from: '0x576da7124c7bb65a692d95848276367e5a844d95',
                    gas: '0x38556',
                    gasUsed: '0x13d41',
                    to: '0x5db3c8a942333f6468176a870db36eef120a34dc',
                    input: '0x23b872dd000000000000000000000000a416bdda32b00e218f08ace220bab512c863ff2f0000000000000000000000001a8abd6d5627eb26ad71c0c7ae5224cdc640faf3000000000000000000000000000000000000000000000278e72c3332ed8c0000',
                    output: '0x0000000000000000000000000000000000000000000000000000000000000001',
                    value: '0x0',
                    type: 'CALL'
                },
                {
                    from: '0x576da7124c7bb65a692d95848276367e5a844d95',
                    gas: '0x23fbe',
                    gasUsed: '0x17a5a',
                    to: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                    input: '0x022c0d9f0000000000000000000000000000000000000000000000101ed507302f2399790000000000000000000000000000000000000000000000000000000000000000000000000000000000000000576da7124c7bb65a692d95848276367e5a844d9500000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000',
                    calls: [
                        {
                            from: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            gas: '0x21815',
                            gasUsed: '0x995c',
                            to: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                            input: '0xa9059cbb000000000000000000000000576da7124c7bb65a692d95848276367e5a844d950000000000000000000000000000000000000000000000101ed507302f239979',
                            output: '0x0000000000000000000000000000000000000000000000000000000000000001',
                            value: '0x0',
                            type: 'CALL'
                        },
                        {
                            from: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            gas: '0x17a14',
                            gasUsed: '0x2b1',
                            to: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                            input: '0x70a082310000000000000000000000001a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            output: '0x000000000000000000000000000000000000000000002d1d3f68178f8a5369de',
                            type: 'STATICCALL'
                        },
                        {
                            from: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            gas: '0x1713b',
                            gasUsed: '0xd9e',
                            to: '0x5db3c8a942333f6468176a870db36eef120a34dc',
                            input: '0x70a082310000000000000000000000001a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            output: '0x00000000000000000000000000000000000000000006e8628a2abd373092f233',
                            type: 'STATICCALL'
                        }
                    ],
                    value: '0x0',
                    type: 'CALL'
                },
                {
                    from: '0x576da7124c7bb65a692d95848276367e5a844d95',
                    gas: '0xc4b5',
                    gasUsed: '0x6d1c',
                    to: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                    input: '0x2e1a7d4d0000000000000000000000000000000000000000000000101ed507302f239979',
                    calls: [
                        {
                            from: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                            gas: '0x8fc',
                            gasUsed: '0x53',
                            to: '0x576da7124c7bb65a692d95848276367e5a844d95',
                            input: '0x',
                            value: '0x101ed507302f239979',
                            type: 'CALL'
                        }
                    ],
                    value: '0x0',
                    type: 'CALL'
                },
                {
                    from: '0x576da7124c7bb65a692d95848276367e5a844d95',
                    gas: '0x3b6e',
                    gasUsed: '0x0',
                    to: '0xa416bdda32b00e218f08ace220bab512c863ff2f',
                    input: '0x',
                    value: '0x101ed507302f239979',
                    type: 'CALL'
                }
            ],
            value: '0x0',
            type: 'CALL'
        };
        const actual = (
            await TraceTransactionClause.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toEqual(expected);
    });
});
