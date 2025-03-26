import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when an unsupported operation
 * is attempted within the application or SDK.
 *
 * This error extends the `VeChainSDKError` to provide additional
 * context and categorization specific to unsupported operations.
 *
 * Can be used to signal that a certain method, function, or operation
 * is not permitted, not available, or not yet implemented.
 */
class UnsupportedOperationError extends VeChainSDKError {}

export { UnsupportedOperationError };
