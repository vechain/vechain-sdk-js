import { describe, expect, test } from '@jest/globals';
import { NetAddr } from '../../../thorest/src';
import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';

/**
 * Test NetAddr class.
 * @group unit/vcdm
 */
describe('NetAddr class tests', () => {
    describe('Construction tests', () => {
        test('Return a NetAddr instance if the passed argument is a valid IP:port string', () => {
            const exp = '192.168.1.1:8080';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance with minimum valid values', () => {
            const exp = '0.0.0.0:0';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Return a NetAddr instance with maximum valid values', () => {
            const exp = '255.255.255.255:65535';
            const addr = NetAddr.of(exp);
            expect(addr).toBeInstanceOf(NetAddr);
            expect(addr.toString()).toEqual(exp);
        });

        test('Throw an exception if IP octets are invalid', () => {
            expect(() => NetAddr.of('256.1.2.3:8080')).toThrow(InvalidDataType);
            expect(() => NetAddr.of('1.2.3.256:8080')).toThrow(InvalidDataType);
            expect(() => NetAddr.of('-1.2.3.4:8080')).toThrow(InvalidDataType);
        });

        test('Throw an exception if port is invalid', () => {
            expect(() => NetAddr.of('192.168.1.1:65536')).toThrow(
                InvalidDataType
            );
            expect(() => NetAddr.of('192.168.1.1:-1')).toThrow(InvalidDataType);
        });

        test('Throw an exception if format is invalid', () => {
            expect(() => NetAddr.of('192.168.1:8080')).toThrow(InvalidDataType);
            expect(() => NetAddr.of('192.168.1.1.1:8080')).toThrow(
                InvalidDataType
            );
            expect(() => NetAddr.of('192.168.1.1:')).toThrow(InvalidDataType);
            // eslint-disable-next-line sonarjs/no-hardcoded-ip
            expect(() => NetAddr.of('192.168.1.1')).toThrow(InvalidDataType);
            expect(() => NetAddr.of(':8080')).toThrow(InvalidDataType);
            expect(() => NetAddr.of('invalid')).toThrow(InvalidDataType);
        });
    });

    describe('Value representation tests', () => {
        test('toString() returns the correct string representation', () => {
            const testCases = [
                '192.168.1.1:8080',
                '10.0.0.1:443',
                '172.16.0.1:3000'
            ];

            testCases.forEach((testCase) => {
                const addr = NetAddr.of(testCase);
                expect(addr.toString()).toEqual(testCase);
            });
        });

        test('Maintains leading zeros in port number', () => {
            const addr = NetAddr.of('192.168.1.1:0080');
            expect(addr.toString()).toEqual('192.168.1.1:80');
        });
    });

    describe('Edge cases', () => {
        test('Handles IP addresses with leading zeros', () => {
            const addr = NetAddr.of('192.168.001.001:8080');
            expect(addr.toString()).toEqual('192.168.1.1:8080');
        });

        test('Handles whitespace in input', () => {
            expect(() => NetAddr.of(' 192.168.1.1:8080 ')).toThrow(
                InvalidDataType
            );
            expect(() => NetAddr.of('192.168.1.1 :8080')).toThrow(
                InvalidDataType
            );
            expect(() => NetAddr.of('192.168.1.1: 8080')).toThrow(
                InvalidDataType
            );
        });
    });

    describe('Method tests', () => {
        test('compareTo method always throws an error', () => {
            const addr1 = NetAddr.of('192.168.1.1:8080');
            const addr2 = NetAddr.of('10.0.0.1:443');
            expect(() => addr1.compareTo(addr2)).toThrow(InvalidOperation);
        });

        test('isEqual method tests', () => {
            const addr1 = NetAddr.of('192.168.1.1:8080');
            const addr2 = NetAddr.of('192.168.1.1:8080');
            const addr3 = NetAddr.of('10.0.0.1:443');
            expect(addr1.isEqual(addr2)).toBeTruthy();
            expect(addr1.isEqual(addr3)).toBeFalsy();
        });

        test('bytes method returns correct byte array', () => {
            const addr = NetAddr.of('192.168.1.1:8080');
            const expectedBytes = new Uint8Array([192, 168, 1, 1, 31, 144]);
            expect(addr.bytes).toEqual(expectedBytes);
        });
    });
});
