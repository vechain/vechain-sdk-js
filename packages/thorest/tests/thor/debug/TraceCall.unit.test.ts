import { describe, expect, jest, test } from '@jest/globals';
import {
    PostDebugTracerCallRequest,
    TraceCall,
    type PostDebugTracerCallRequestJSON
} from '@thor/debug';
import {
    Address,
    Gas,
    HexUInt,
    UInt,
    Units,
    VET,
    VTHO
} from '@vechain/sdk-core';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockUnitTestClient';

/**
 * VeChain trace call - unit
 *
 * @group unit/debug
 */
describe('TraceCall unit tests', () => {
    describe('PostDebugTracerCallRequest', () => {
        test('constructs with all fields', () => {
            const json: PostDebugTracerCallRequestJSON = {
                name: 'call',
                config: { some: 'config' },
                value: '0x0',
                data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
                to: '0x0000000000000000000000000000456E65726779',
                gas: 50000,
                gasPrice: '1000000000000000',
                caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                provedWork: '1000',
                gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
                expiration: 1000,
                blockRef: '0x00000000851caf3c'
            };

            const request = new PostDebugTracerCallRequest(json);
            expect(request.name?.toString()).toBe(json.name);
            expect(request.config).toEqual(json.config);
            expect(request.value).toEqual(VET.of(json.value));
            expect(request.data).toEqual(HexUInt.of(json.data));
            expect(request.to).toEqual(
                json.to !== undefined && json.to !== ''
                    ? Address.of(json.to)
                    : undefined
            );
            expect(request.gas).toEqual(
                json.gas !== undefined && json.gas !== 0
                    ? Gas.of(json.gas)
                    : undefined
            );
            expect(request.gasPrice).toEqual(
                json.gasPrice !== undefined && json.gasPrice !== ''
                    ? VTHO.of(json.gasPrice, Units.wei)
                    : undefined
            );
            expect(request.caller).toEqual(
                json.caller !== undefined && json.caller !== ''
                    ? Address.of(json.caller)
                    : undefined
            );
            expect(request.provedWork?.valueOf()).toBe(
                json.provedWork !== undefined && json.provedWork !== ''
                    ? Number(json.provedWork)
                    : undefined
            );
            expect(request.gasPayer).toEqual(
                json.gasPayer !== undefined && json.gasPayer !== ''
                    ? Address.of(json.gasPayer)
                    : undefined
            );
            expect(request.expiration).toEqual(
                json.expiration !== undefined && json.expiration !== 0
                    ? UInt.of(json.expiration)
                    : undefined
            );
            expect(request.blockRef).toBeUndefined();
        });

        test('constructs with minimal fields', () => {
            const json: PostDebugTracerCallRequestJSON = {
                value: '0x0',
                data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000'
            };

            const request = new PostDebugTracerCallRequest(json);
            expect(request.name).toBeUndefined();
            expect(request.config).toBeUndefined();
            expect(request.value).toEqual(VET.of(json.value));
            expect(request.data).toEqual(HexUInt.of(json.data));
            expect(request.to).toBeUndefined();
            expect(request.gas).toBeUndefined();
            expect(request.gasPrice).toBeUndefined();
            expect(request.caller).toBeUndefined();
            expect(request.provedWork).toBeUndefined();
            expect(request.gasPayer).toBeUndefined();
            expect(request.expiration).toBeUndefined();
            expect(request.blockRef).toBeUndefined();
        });

        test('toJSON returns correct format', () => {
            const json: PostDebugTracerCallRequestJSON = {
                name: 'call',
                config: { some: 'config' },
                value: '0x0',
                data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
                to: '0x0000000000000000000000000000456E65726779',
                gas: 50000,
                gasPrice: '1000000000000000',
                caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                provedWork: '1000',
                gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
                expiration: 1000,
                blockRef: '0x00000000851caf3c'
            };

            const request = new PostDebugTracerCallRequest(json);
            const serialized = request.toJSON();

            // Normalize the expected JSON to match the actual output format
            const expectedJson = {
                ...json,
                value: '0x00',
                caller:
                    json.caller !== undefined && json.caller !== ''
                        ? Address.of(json.caller).toString()
                        : undefined,
                gasPayer:
                    json.gasPayer !== undefined && json.gasPayer !== ''
                        ? Address.of(json.gasPayer).toString()
                        : undefined,
                to:
                    json.to !== undefined && json.to !== ''
                        ? Address.of(json.to).toString()
                        : undefined,
                blockRef: undefined
            };

            expect(serialized).toEqual(expectedJson);
        });
    });

    describe('TraceCall', () => {
        test('static of() creates instance correctly', () => {
            const json: PostDebugTracerCallRequestJSON = {
                name: 'call',
                value: '0x0',
                data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
                to: '0x0000000000000000000000000000456E65726779'
            };

            const request = TraceCall.of(json);
            expect(request).toBeInstanceOf(TraceCall);
            expect(request.request).toBeInstanceOf(PostDebugTracerCallRequest);

            // Normalize the expected JSON to match the actual output format
            const expectedJson = {
                ...json,
                value: '0x00',
                to:
                    json.to !== undefined && json.to !== ''
                        ? Address.of(json.to).toString()
                        : undefined,
                blockRef: undefined,
                caller: undefined,
                config: undefined,
                expiration: undefined,
                gas: undefined,
                gasPayer: undefined,
                gasPrice: undefined,
                provedWork: undefined
            };

            expect(request.request.toJSON()).toEqual(expectedJson);
        });

        test('askTo() processes response correctly', async () => {
            const requestJson: PostDebugTracerCallRequestJSON = {
                name: 'call',
                value: '0x0',
                data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
                to: '0x0000000000000000000000000000456E65726779'
            };

            const mockResponse = {
                gas: 21000,
                failed: false,
                returnValue: '0x',
                structLogs: []
            } as unknown;

            const mockClient = mockHttpClient<unknown>(mockResponse, 'post');

            const request = TraceCall.of(requestJson);
            const result = await request.askTo(mockClient);

            // Normalize the expected JSON to match the actual output format
            const expectedRequestJson = {
                ...requestJson,
                value: '0x00',
                to:
                    requestJson.to !== undefined && requestJson.to !== ''
                        ? Address.of(requestJson.to).toString()
                        : undefined,
                blockRef: undefined,
                caller: undefined,
                config: undefined,
                expiration: undefined,
                gas: undefined,
                gasPayer: undefined,
                gasPrice: undefined,
                provedWork: undefined
            };

            const postSpy = jest.spyOn(mockClient, 'post');
            expect(postSpy).toHaveBeenCalledWith(
                TraceCall.PATH,
                { query: '' },
                expectedRequestJson
            );

            expect(result.request).toBe(request);
            expect(result.response).toEqual(mockResponse);
        });

        test('askTo() handles error response', async () => {
            const requestJson: PostDebugTracerCallRequestJSON = {
                name: 'call',
                value: '0x0',
                data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000'
            };

            const request = TraceCall.of(requestJson);
            await expect(
                request.askTo(mockHttpClientWithError('Network error', 'post'))
            ).rejects.toThrow('Network error');
        });
    });
});
