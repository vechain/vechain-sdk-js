import { type Abi, decodeErrorResult } from '@viem';
import type { Hex } from '@common/vcdm';
import { ABIDecodeError } from '@common/errors/ABIDecodeError';
import { log } from '@common/logging';

const FQP = 'thor-client/contracts/utils';

const PANIC_SELECTOR = '0x4e487b71'; // Panic(uint256) selector
const ERROR_SELECTOR = '0x08c379a0'; // Error(string)

/**
 * Decodes a revert reason/error data returned by an EVM node.
 * - If it's Error(string), returns the message
 * - If it's Panic(uint256), returns `Panic(0x..)`
 * - If it's a custom error (and you pass an ABI), returns `ErrorName(arg1, arg2, ...)`
 * - Otherwise returns undefined
 */
export function decodeRevertReason(data: Hex, abi?: Abi): string | undefined {
    try {
        if (data.asHex() === '0x') {
            return undefined;
        }
        const selector = data.asHex().slice(0, 10).toLowerCase();
        // If no ABI and not a standard selector, its a custom error -> need ABI
        if (
            abi === undefined &&
            selector !== PANIC_SELECTOR &&
            selector !== ERROR_SELECTOR
        ) {
            throw new ABIDecodeError(
                `${FQP}.decodeRevertReason()`,
                'No ABI for custom error'
            );
        }
        // decode using viem
        const { errorName, args } = decodeErrorResult({
            abi,
            data: data.asHex()
        });
        // Standard Solidity Error(string)
        if (
            errorName === 'Error' &&
            args?.length !== undefined &&
            typeof args[0] === 'string'
        ) {
            return args[0];
        }
        // Standard Solidity Panic(uint256)
        if (
            errorName === 'Panic' &&
            args?.length !== undefined &&
            typeof args[0] === 'bigint'
        ) {
            const code = args[0];
            return `Panic(0x${code.toString(16).padStart(2, '0')})`;
        }

        // Custom error (when ABI provided)
        if (abi !== undefined) {
            const formattedArgs =
                args
                    ?.map((a) =>
                        typeof a === 'bigint' ? a.toString() : JSON.stringify(a)
                    )
                    .join(', ') ?? '';
            return `${errorName}(${formattedArgs})`;
        }

        // Unknown / no ABI for custom error
        throw new ABIDecodeError(
            `${FQP}.decodeRevertReason()`,
            'No ABI for custom error'
        );
    } catch (error) {
        log.error({
            message: 'Failed to decode revert reason',
            context: {
                data: data.asHex()
            }
        });
        if (error instanceof ABIDecodeError) {
            throw error;
        }
        // Not valid error data
        throw new ABIDecodeError(
            `${FQP}.decodeRevertReason()`,
            'Not valid error data'
        );
    }
}

/**
 * Data utilities for contract interactions
 */
export const dataUtils = {
    /**
     * Encodes a string to bytes32 format
     * @param value - The string value to encode
     * @param alignment - The alignment direction ('left' or 'right')
     * @returns The encoded bytes32 string
     */
    encodeBytes32String(
        value: string,
        alignment: 'left' | 'right' = 'left'
    ): string {
        // Convert string to bytes32 format
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);

        // Pad to 32 bytes
        const padded = new Uint8Array(32);
        if (alignment === 'left') {
            padded.set(bytes.slice(0, 32));
        } else {
            padded.set(bytes.slice(0, 32), 32 - bytes.length);
        }

        // Convert to hex string
        return `0x${Array.from(padded)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')}`;
    }
};
