import { describe, expect, test } from '@jest/globals';
import { Address, HexUInt, IllegalArgumentError } from '@common';
import { Clause } from '@thor/thorest/model';
import { type ClauseJSON } from '@thor/thorest/json';

const addrStr = '0x' + '1'.repeat(40); // 20-byte address
const otherAddrStr = '0x' + '2'.repeat(40);

/*
 * @group unit/thor/thorest/model
 */
describe('Clause class tests', () => {
    describe('of(json) construction', () => {
        test('ok <- creates Clause with address, value and data', () => {
            const json: ClauseJSON = {
                to: addrStr,
                value: '0x0a',
                data: '0xdeadbeef'
            };
            const clause = Clause.of(json);

            expect(clause).toBeInstanceOf(Clause);
            expect(clause.to?.toString()).toEqual(
                Address.of(addrStr).toString()
            );
            expect(clause.value).toEqual(HexUInt.of('0x0a').bi);
            expect(clause.data?.toString()).toEqual(
                HexUInt.of('0xdeadbeef').toString()
            );
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('ok< - creates Clause for contract deployment (to = null) and no data field', () => {
            const json: ClauseJSON = {
                to: null,
                value: '0x00'
                // data is omitted
            };
            const clause = Clause.of(json);

            expect(clause.to).toBeNull();
            expect(clause.value).toEqual(0n);
            expect(clause.data).toBeNull();
        });

        test('err <- throws IllegalArgumentError for invalid value hex', () => {
            const bad = {
                to: addrStr,
                value: 'notahex'
            } satisfies ClauseJSON;
            expect(() => Clause.of(bad)).toThrow(IllegalArgumentError);
        });

        test('err <- throws IllegalArgumentError for invalid address', () => {
            const bad = {
                to: '0xbad_address',
                value: '0x01'
            } satisfies ClauseJSON;
            expect(() => Clause.of(bad)).toThrow(IllegalArgumentError);
        });

        test('err <- throws IllegalArgumentError for invalid data hex', () => {
            const bad = {
                to: addrStr,
                value: '0x01',
                data: '0xzz'
            } satisfies ClauseJSON;
            expect(() => Clause.of(bad)).toThrow(IllegalArgumentError);
        });
    });

    describe('toJSON()', () => {
        test('ok <- serializes with normalized address and quantity; data defaults to 0x when null', () => {
            const jsonIn: ClauseJSON = {
                to: otherAddrStr,
                value: '0x000a'
                // data omitted -> will be null in instance -> "0x" in JSON
            };
            const clause = Clause.of(jsonIn);
            const jsonOut = clause.toJSON();

            // Address normalized via Address.toString()
            expect(jsonOut.to).toEqual(Address.of(otherAddrStr).toString());

            // Value normalized as Quantity hex
            expect(jsonOut.value).toEqual('0xa');

            // Data defaults to Hex.PREFIX ("0x") when no data was provided
            expect(jsonOut.data).toEqual('0x');

            // Ensure non-serialized fields are not present
            expect(
                Object.prototype.hasOwnProperty.call(jsonOut, 'comment')
            ).toBe(false);
            expect(Object.prototype.hasOwnProperty.call(jsonOut, 'abi')).toBe(
                false
            );
        });

        test('ok <- round-trip retains semantics', () => {
            const original: ClauseJSON = {
                to: addrStr,
                value: '0x0a',
                data: '0x'
            };
            const clause = Clause.of(original);
            const roundTrip = clause.toJSON();

            // to is normalized, value is normalized, data "0x" remains "0x"
            expect(roundTrip.to).toEqual(Address.of(addrStr).toString());
            expect(roundTrip.value).toEqual('0xa');
            expect(roundTrip.data).toEqual('0x');
        });

        test('ok <- serializes non-null data correctly', () => {
            const original: ClauseJSON = {
                to: addrStr,
                value: '0x1',
                data: '0x00ff'
            };
            const clause = Clause.of(original);
            const json = clause.toJSON();
            expect(json.data).toEqual(HexUInt.of('0x00ff').toString());
        });
    });
});
