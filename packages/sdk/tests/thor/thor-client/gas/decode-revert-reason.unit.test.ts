import { describe, expect, test } from '@jest/globals';
import { decodeRevertReason } from '@thor/thor-client/contracts/utils';
import { Hex } from '@common/vcdm';
import { encodeErrorResult } from 'viem';
import { ABIDecodeError } from '@common/errors/ABIDecodeError';

/**
 * @group unit
 */
describe('decodeRevertReason', () => {
    test('decodes Error(string)', () => {
        const data = Hex.of(
            '0x' +
                // selector: Error(string)
                '08c379a0' +
                // offset to data (32 bytes)
                '0000000000000000000000000000000000000000000000000000000000000020' +
                // length = 36 (0x24)
                '0000000000000000000000000000000000000000000000000000000000000024' +
                // utf8 bytes for: "Error with special chars: !@$%^&*()'"
                '4572726f722077697468207370656369616c2063686172733a20214024255e262a282927' +
                // pad to 32-byte boundary (36 bytes -> add 28 zero bytes)
                '00000000000000000000000000000000000000000000000000000000000000'
        );

        const result = decodeRevertReason(data);
        expect(result).toBe("Error with special chars: !@$%^&*()'");
    });
    test('decodes Panic(uint256) code 0x11', () => {
        const data = Hex.of(
            '0x' +
                '4e487b71' + // selector
                '0000000000000000000000000000000000000000000000000000000000000011' // code = 0x11
        );

        const result = decodeRevertReason(data);
        expect(result).toBe('Panic(0x11)');
    });
    test('decodes custom error with ABI', () => {
        const CustomAbi = [
            {
                type: 'error',
                name: 'NotAuthorized',
                inputs: [{ name: 'who', type: 'address' }]
            }
        ] as const;

        const addr = '0x1111111111111111111111111111111111111111';
        const data = encodeErrorResult({
            abi: CustomAbi,
            errorName: 'NotAuthorized',
            args: [addr]
        });
        const result = decodeRevertReason(Hex.of(data), CustomAbi);
        // Your implementation JSON.stringifys non-bigints, hence quotes:
        expect(result).toBe(`NotAuthorized("${addr}")`);
    });
    test('throws for custom error without ABI', () => {
        const CustomAbi = [
            { type: 'error', name: 'Foo', inputs: [{ type: 'uint256' }] }
        ] as const;

        const data = encodeErrorResult({
            abi: CustomAbi,
            errorName: 'Foo',
            args: [123n]
        });

        expect(() => decodeRevertReason(Hex.of(data))).toThrow(ABIDecodeError);
    });
    test('returns undefined for empty data', () => {
        const data = Hex.of('0x');
        const result = decodeRevertReason(data);
        expect(result).toBeUndefined();
    });
});
