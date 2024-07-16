import { VechainSDKError } from '../sdk-error';

/**
 * Invalid address error to be thrown when an invalid address is detected.
 *
 * This error is thrown when an invalid address is detected.
 */
class InvalidAddress extends VechainSDKError<{ address: string }> {}

export { InvalidAddress };
