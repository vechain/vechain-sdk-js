import { describe, expect, jest, test } from '@jest/globals';
import { type PostDebugTracerCallRequestJSON, TraceCall } from '@thor/debug';
import { Hex, IllegalArgumentError, Revision } from '@vcdm';
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
describe('TraceCall UNIT tests', () => {
    test('err <- of() - illegal request', () => {
        const json = {
            name: 'call',
            value: 'illegal value',
            data: 'illegal data',
            to: 'illegal to'
        } satisfies PostDebugTracerCallRequestJSON;
        expect(() => TraceCall.of(json)).toThrowError(IllegalArgumentError);
    });

    test('err <- askTo() - mock invalid request body response', async () => {
        const status = 400;
        // legal request, else it would be rejected by of() method
        const request = {
            value: '0x0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        try {
            await TraceCall.of(request).askTo(
                mockHttpClient<Response>(
                    mockResponse('Invalid request body', status)
                )
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('err <- of() - revision not found', async () => {
        const status = 400;
        const revision = Revision.of(Hex.of('0xBADC0FFEE'));
        const request = {
            value: '0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        try {
            await TraceCall.of(request)
                .withRevison(revision)
                .askTo(
                    mockHttpClient<Response>(
                        mockResponse('Revision not found', status)
                    )
                );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- askTo() - no revision', async () => {
        const request = {
            value: '0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        const expected = {
            from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            gas: '0x0',
            gasUsed: '0x0',
            to: '0x0000000000000000000000000000456e65726779',
            input: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            output: '0x0000000000000000000000000000000000000000000000000000000000000001',
            value: '0x0',
            type: 'CALL'
        };
        const actual = (
            await TraceCall.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });

    test('ok <- askTo() - FINALIZED revision', async () => {
        const request = {
            value: '0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        const expected = {
            from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            gas: '0x0',
            gasUsed: '0x0',
            to: '0x0000000000000000000000000000456e65726779',
            input: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            output: '0x0000000000000000000000000000000000000000000000000000000000000001',
            value: '0x0',
            type: 'CALL'
        };
        const actual = (
            await TraceCall.of(request)
                .withRevison(Revision.FINALIZED)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });

    test('ok <- askTo() - numeric revision', async () => {
        const request = {
            value: '0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        const expected = {
            from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            gas: '0x0',
            gasUsed: '0x0',
            to: '0x0000000000000000000000000000456e65726779',
            input: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            output: '0x0000000000000000000000000000000000000000000000000000000000000001',
            value: '0x0',
            type: 'CALL'
        };
        const actual = (
            await TraceCall.of(request)
                .withRevison(Revision.of(0))
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });

    test('ok <- askTo() - hex revision', async () => {
        const request = {
            value: '0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        const expected = {
            from: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            gas: '0x0',
            gasUsed: '0x0',
            to: '0x0000000000000000000000000000456e65726779',
            input: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            output: '0x0000000000000000000000000000000000000000000000000000000000000001',
            value: '0x0',
            type: 'CALL'
        };
        const actual = (
            await TraceCall.of(request)
                .withRevison(Hex.of('0x0'))
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });
});
