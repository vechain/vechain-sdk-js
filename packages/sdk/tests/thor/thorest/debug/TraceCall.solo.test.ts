import { describe, expect, test } from '@jest/globals';
import { FetchHttpClient } from '@common/http';
import { ThorError, ThorNetworks, TraceCall } from '@thor/thorest';
import { Hex, Revision } from '@common/vcdm';
import { type PostDebugTracerCallRequestJSON } from '@thor/thorest/json';

/**
 * @group integration/debug
 */
describe('TraceCall SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

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
            await TraceCall.of(request).withRevison(revision).askTo(httpClient);
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
        const actual = (await TraceCall.of(request).askTo(httpClient)).response;
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
                .askTo(httpClient)
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
                .askTo(httpClient)
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
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });
});
