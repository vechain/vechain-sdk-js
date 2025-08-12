import { describe, expect, test } from '@jest/globals';
import { IllegalArgumentError } from '@common/errors';
import { NetAddr } from '@common/vcdm';

/**
 * Test NetAddr class.
 * @group unit/vcdm
 */
describe('NetAddr class tests', () => {
    describe('Construction tests', () => {
        test('Return a NetAddr instance if the passed argument is a valid IPv4:port string', () => {
            const exp = '192.168.1.1:8080';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance if the passed argument is a valid IPv6:port string', () => {
            const exp = '[2001:db8::1]:8080';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance with minimum valid values - IPv4', () => {
            const exp = '0.0.0.0:0';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance with minimum valid values - IPv6', () => {
            const exp = '[::]:0';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance with maximum valid values - IPv4', () => {
            const exp = '255.255.255.255:65535';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance with maximum valid values - IPv6', () => {
            const exp = '[ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff]:65535';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Throw an exception if IPv4 octets are invalid', () => {
            expect(() => NetAddr.of('256.1.2.3:8080')).toThrow(
                IllegalArgumentError
            );
            expect(() => NetAddr.of('1.2.3.256:8080')).toThrow(
                IllegalArgumentError
            );
            expect(() => NetAddr.of('-1.2.3.4:8080')).toThrow(
                IllegalArgumentError
            );
        });

        test('Throw an exception if IPv6 segments are invalid', () => {
            expect(() => NetAddr.of('[2001:db8::1::1]:8080')).toThrow(
                IllegalArgumentError
            ); // Double ::
            expect(() => NetAddr.of('[gggg::1]:8080')).toThrow(
                IllegalArgumentError
            ); // Invalid hex
            expect(() => NetAddr.of('[2001:db8:1]:8080')).toThrow(
                IllegalArgumentError
            ); // Too few segments
        });

        test('Throw an exception if port is invalid', () => {
            expect(() => NetAddr.of('192.168.1.1:65536')).toThrow(
                IllegalArgumentError
            );
            expect(() => NetAddr.of('[2001:db8::1]:65536')).toThrow(
                IllegalArgumentError
            );
            expect(() => NetAddr.of('192.168.1.1:-1')).toThrow(
                IllegalArgumentError
            );
            expect(() => NetAddr.of('[2001:db8::1]:-1')).toThrow(
                IllegalArgumentError
            );
        });

        test('Throw an exception if format is invalid', () => {
            // IPv4 invalid formats
            expect(() => NetAddr.of('192.168.1:8080')).toThrow(
                IllegalArgumentError
            );
            expect(() => NetAddr.of('192.168.1.1.1:8080')).toThrow(
                IllegalArgumentError
            );

            // IPv6 invalid formats
            expect(() => NetAddr.of('2001:db8::1:8080')).toThrow(
                IllegalArgumentError
            ); // Missing brackets
            expect(() => NetAddr.of('[2001:db8::1]8080')).toThrow(
                IllegalArgumentError
            ); // Missing colon
            expect(() => NetAddr.of('[2001:db8::1')).toThrow(
                IllegalArgumentError
            ); // Missing closing bracket
        });
    });

    describe('Value representation tests', () => {
        test('toString() returns the correct string representation', () => {
            const testCases = [
                '192.168.1.1:8080',
                '[2001:db8::1]:8080',
                '[2001:db8:85a3:8d3:1319:8a2e:370:7348]:443',
                '[::1]:3000'
            ];

            testCases.forEach((testCase) => {
                const addr = NetAddr.of(testCase);
                expect(addr.toString()).toEqual(testCase);
            });
        });

        test('Handles IPv6 address compression correctly', () => {
            const cases = [
                {
                    input: '[::1]:8080',
                    expected: '[::1]:8080'
                },
                {
                    input: '[2001:db8::1]:8080',
                    expected: '[2001:db8::1]:8080'
                },
                {
                    input: '[2001:0:0:0:0:0:0:1]:8080',
                    expected: '[2001::1]:8080'
                }
            ];

            cases.forEach(({ input, expected }) => {
                const addr = NetAddr.of(input);
                expect(addr.toString()).toEqual(expected);
            });
        });
    });

    describe('Method tests', () => {
        test('bytes method returns correct byte array for IPv4', () => {
            const addr = NetAddr.of('192.168.1.1:8080');
            const expectedBytes = new Uint8Array([192, 168, 1, 1, 31, 144]);
            expect(addr.bytes).toEqual(expectedBytes);
        });

        test('bytes method returns correct byte array for IPv6', () => {
            const addr = NetAddr.of('[2001:db8::1]:8080');
            const expectedBytes = new Uint8Array([
                0x20,
                0x01,
                0x0d,
                0xb8,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x00,
                0x01,
                31,
                144 // Port 8080
            ]);
            expect(addr.bytes).toEqual(expectedBytes);
        });

        test('isEqual method tests with mixed address types', () => {
            const addr1 = NetAddr.of('[2001:db8::1]:8080');
            const addr2 = NetAddr.of('[2001:db8::1]:8080');
            const addr3 = NetAddr.of('[2001:db8::2]:8080');
            const addr4 = NetAddr.of('192.168.1.1:8080');

            expect(addr1.isEqual(addr2)).toBeTruthy();
            expect(addr1.isEqual(addr3)).toBeFalsy();
            expect(addr1.isEqual(addr4)).toBeFalsy();
        });
    });
});
