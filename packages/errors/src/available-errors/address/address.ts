import { VechainSDKError } from '../sdk-error';

/**
 * Invalid address error
 *
 * WHEN TO USE:
 * * This error will be thrown when the address is invalid.
 */
class InvalidAddress extends VechainSDKError<{ address: string }> {}

export { InvalidAddress };
