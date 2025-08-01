import { expect, test } from '@jest/globals';
import { Address, HexUInt, UInt } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import { PostDebugTracerCallRequest } from '@thor/thorest/debug';
import { type PostDebugTracerCallRequestJSON } from '@thor/thorest/json';

/**
 * @group unit/debug
 */
describe('PostDebugTracerCallRequest UNIT tests', () => {
    test('err <- invalid value', () => {
        const expected = {
            name: 'call',
            config: { some: 'config' },
            value: 'invalid value',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            to: '0x0000000000000000000000000000456E65726779',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c'
        } satisfies PostDebugTracerCallRequestJSON;
        expect(() => new PostDebugTracerCallRequest(expected)).toThrow(
            IllegalArgumentError
        );
    });

    test('ok <- constructor with all fields', () => {
        const expected = {
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
        } satisfies PostDebugTracerCallRequestJSON;

        const actual = new PostDebugTracerCallRequest(expected);
        expect(actual.name?.toString()).toBe(expected.name);
        expect(actual.config).toEqual(expected.config);
        expect(actual.value).toEqual(HexUInt.of(expected.value).bi);
        expect(actual.data).toEqual(HexUInt.of(expected.data));
        expect(actual.to).toEqual(Address.of(expected.to));
        expect(actual.gas).toEqual(BigInt(expected.gas));
        expect(actual.gasPrice).toEqual(BigInt(expected.gasPrice));
        expect(actual.caller).toEqual(Address.of(expected.caller));
        expect(actual.provedWork).toEqual(
            UInt.of(Number(expected.provedWork)).valueOf()
        );
        expect(actual.gasPayer).toEqual(Address.of(expected.gasPayer));
        expect(actual.expiration).toEqual(
            UInt.of(expected.expiration).valueOf()
        );
        expect(actual.blockRef).toEqual(HexUInt.of(expected.blockRef));
    });

    test('ok <- constructor with minimal fields', () => {
        const expected: PostDebugTracerCallRequestJSON = {
            value: '0x0',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000'
        } satisfies PostDebugTracerCallRequestJSON;

        const actual = new PostDebugTracerCallRequest(expected);
        expect(actual.name).toBeNull();
        expect(actual.config).toBeNull();
        expect(actual.value).toEqual(HexUInt.of(expected.value).bi);
        expect(actual.data).toEqual(HexUInt.of(expected.data));
        expect(actual.to).toBeNull();
        expect(actual.gas).toBeNull();
        expect(actual.gasPrice).toBeNull();
        expect(actual.caller).toBeNull();
        expect(actual.provedWork).toBeNull();
        expect(actual.gasPayer).toBeNull();
        expect(actual.expiration).toBeNull();
        expect(actual.blockRef).toBeNull();
    });

    test('toJSON returns correct format', () => {
        const json = {
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
        } satisfies PostDebugTracerCallRequestJSON;

        const actual = new PostDebugTracerCallRequest(json).toJSON();

        // Normalize the expected JSON to match the actual output format
        const expected = {
            ...json,
            value: '0x0',
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
            blockRef: '0x00000000851caf3c'
        };

        expect(actual).toEqual(expected);
    });
});
