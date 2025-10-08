import { type Abi } from '@viem';
import type { Hex } from '@common/vcdm';
import { decodeErrorResult } from '@viem';
import { ABIDecodeError } from '@common/errors/ABIDecodeError';
import { log } from '@common/logging';

const FQP = 'thor-client/gas/helpers/decode-evm-error';

/**
 * Decodes a revert reason/error data returned by an EVM node.
 * - If it's Error(string), returns the message
 * - If it's Panic(uint256), returns `Panic(0x..)`
 * - If it's a custom error (and you pass an ABI), returns `ErrorName(arg1, arg2, ...)`
 * - Otherwise returns undefined
 */
function decodeRevertReason(data: Hex, abi?: Abi): string | undefined {
    try {
        if (data.asHex() === '0x') {
            return undefined;
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

export { decodeRevertReason };
