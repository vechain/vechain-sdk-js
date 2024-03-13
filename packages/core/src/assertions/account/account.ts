import { assert, DATA } from '@vechain/sdk-errors';
import { addressUtils } from '../../address';

/**
 * Assert if address is valid
 *
 * @param methodName - The name of the method calling this assertion.
 * @param address - Address to assert
 */
function assertIsAddress(methodName: string, address: string): void {
    assert(
        `assertIsAddress - ${methodName}`,
        addressUtils.isAddress(address),
        DATA.INVALID_DATA_TYPE,
        'Invalid address. The address must be 20 bytes (a 42 characters hex string with a `0x` prefix.)',
        { address }
    );
}

export { assertIsAddress };
