import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when an ABI decode error occurs.
 *
 * This error extends the `VeChainSDKError` to provide additional
 * context and categorization specific to ABI decode errors.
 */
class ABIDecodeError extends VeChainSDKError {}

export { ABIDecodeError };
