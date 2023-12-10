import { abi } from '@vechainfoundation/vechain-sdk-core';
import { SOLIDITY_ERROR_SELECTOR, SOLIDITY_PANIC_SELECTOR } from './const';

/**
 * Decodes the revert reason of the smart contract call or transaction.
 * Both the `Error(string)` and `Panic(uint256)` functions in Solidity are supported.
 *
 * @param data - The data in hex string format of the error or panic message.
 *
 * @returns The decoded revert reason.
 */
const decodeRevertReason = (data: string): string | bigint | undefined => {
    if (data.startsWith(SOLIDITY_ERROR_SELECTOR))
        return abi.decode<bigint | string>(
            'string',
            `0x${data.slice(SOLIDITY_ERROR_SELECTOR.length)}`
        );

    if (data.startsWith(SOLIDITY_PANIC_SELECTOR))
        return abi.decode<bigint | string>(
            'uint256',
            `0x${data.slice(SOLIDITY_PANIC_SELECTOR.length)}`
        );
};

export { decodeRevertReason };
