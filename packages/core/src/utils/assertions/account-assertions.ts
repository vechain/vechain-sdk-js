import { DATA, assert } from '@vechain/vechain-sdk-errors';
import { addressUtils } from '../../address';

/**
 * Assert if address is valid
 *
 * @param address - Address to assert
 */
function assertIsAddress(address: string): void {
    assert(
        addressUtils.isAddress(address),
        DATA.INVALID_DATA_TYPE,
        'Invalid address. The address must be 20 bytes (a 42 characters hex string with a `0x` prefix.)',
        { address }
    );
}

export { assertIsAddress };
